#include <eosacl.hpp>

ACTION eosacl::claimlock(name owner, uint8_t lock_id) {
  require_auth(owner); // anyone can claim lock, the contract eats the costs for doing so?
  
  // Find the lock the _locks table
  auto lock_itr = _locks.find(lock_id);
  
  // need to verify that the lock_id is not already claimed
  check(lock_itr == _locks.end(), "lock has already been claimed.");
  
  // create a new lock in entry in the _locks table
  _locks.emplace(owner, [&](auto& new_lock) { // owner is paying for the storage of this
    // creating a new lock instance
    lock _lock = {lock_id, {owner}};
    
    new_lock.lock_id = lock_id;
    new_lock.lock_details = _lock;
  });

}

ACTION eosacl::sharekey(name sender, name recipient, uint8_t lock_id) {
  require_auth(sender);


  // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exsist");

  // TODO: need to verify sender has a key to lock_id

  // Modify the lock table entry, adding the recipient to the lock.admins vector
  _locks.modify(lock, sender, [&](auto& modified_lock) { // sender is paying for the storage
    struct lock& modified_lock_detials = modified_lock.lock_details;
    vector<name>& admins = modified_lock_detials.admins;
    admins.insert(admins.begin(), recipient);


    //addUserToLock(modified_lock.lock_details, recipient);
    //vector<name> test = {};
    //test.insert(test.begin(), recipient);
    //admins = test;
  });
}

ACTION eosacl::checkaccess(name username, uint8_t lock_id) {
  print ("checking if ", name{username}, " has access to ", uint8_t{lock_id});
}

void eosacl::addUserToLock(lock& lock_detail, name& user) {
  addUserToAdminsVector(lock_detail.admins, user);
}

void eosacl::addUserToAdminsVector(vector<name>& admins, name& user) {
  //admins.insert(admins.size(), user);
}

EOSIO_DISPATCH(eosacl, (claimlock)(sharekey)(checkaccess))
