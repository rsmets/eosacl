#include <eosacl.hpp>

ACTION eosacl::claimlock(name owner, uint8_t lock_id) {
  require_auth(owner); // anyone can claim lock, the contract eats the costs for doing so?
  
  // Find the lock the _locks table
  auto lock_itr = _locks.find(lock_id);
  
  // need to verify that the lock_id is not already claimed
  check(lock_itr == _locks.end(), "lock has already been claimed."); // check reached end, if not then show the error message.
  
  // create a new lock in entry in the _locks table
  _locks.emplace(owner, [&](auto& new_lock) { // owner is paying for the storage of this
    // creating a new lock instance
    lock _lock = {lock_id, {owner}};
    
    new_lock.lock_id = lock_id;
    new_lock.lock_details = _lock;
  });

  // update the user table user's entry with the new key, making the owner pay for it
  addLockToUser(owner, owner, lock_id);
}

ACTION eosacl::sharekey(name sender, name recipient, uint8_t lock_id) {
  require_auth(sender);


  // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exsist");

  // TODO: need to verify sender has a key to lock_id

  // Modify the lock table entry, adding the recipient to the lock.admins vector
  _locks.modify(lock, sender, [&](auto& modified_lock) { // sender is paying for the storage
    //struct lock& modified_lock_detials = modified_lock.lock_details;
    //vector<name>& admins = modified_lock_detials.admins;
    //admins.insert(admins.end(), recipient);

    addUserToLock(modified_lock.lock_details, recipient);
    
    // update the user table user's entry with the new key, making the sender pay for it
    addLockToUser(sender, recipient, lock_id);
  });
}

ACTION eosacl::checkaccess(name username, uint8_t lock_id) {
  print ("checking if ", name{username}, " has access to ", uint8_t{lock_id});


}

void eosacl::addUserToLock(lock& lock_detail, name& user) {
  // add user to the admins list on the lock
  addUserToAdminsVector(lock_detail.admins, user);
}

void eosacl::addLockToUser(name sender, name user, uint8_t lock_id) {
  // Find the user the _users table
  auto user_itr = _users.find(user.value);
  
  if (user_itr == _users.end()) {
    // create a new lock in entry in the _locks table
    _users.emplace(sender, [&](auto& new_user) { // sender is paying for the storage of this
      
      new_user.username = user;
      new_user.lock_ids = {lock_id};
    });
  } else {
    // Modify a user record if it exists
    _users.modify(user_itr, user, [&](auto& modified_user) {
      modified_user.lock_ids.insert(modified_user.lock_ids.end(), lock_id);
    });
  }
}

void eosacl::addUserToAdminsVector(vector<name>& admins, name& user) {
  admins.insert(admins.end(), user);
}

EOSIO_DISPATCH(eosacl, (claimlock)(sharekey)(checkaccess))
