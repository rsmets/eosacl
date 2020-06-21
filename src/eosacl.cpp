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
  _addLockToUser(owner, owner, lock_id);
}

ACTION eosacl::sharekey(name sender, name recipient, uint8_t lock_id) {
  require_auth(sender);

  print ("attempting to send ", name{recipient}, " a key to ", uint8_t{lock_id});

  // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exist");

  // need to verify sender has a key to lock_id
  _checkaccess(sender, lock_id);

  // Modify the lock table entry, adding the recipient to the lock.admins vector
  _locks.modify(lock, sender, [&](auto& modified_lock) { // sender is paying for the storage
    //struct lock& modified_lock_detials = modified_lock.lock_details;
    //vector<name>& admins = modified_lock_detials.admins;
    //admins.insert(admins.end(), recipient);

    _addUserToLock(modified_lock.lock_details, recipient);
    
    // update the user table user's entry with the new key, making the sender pay for it
    _addLockToUser(sender, recipient, lock_id);
  });
}

ACTION eosacl::revokekey(name admin, name target, uint8_t lock_id) {
  require_auth(admin);

  // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exist");

  // get the user from the _users table
  auto& user = _users.get(target.value, "user does not exist");

  // need to verify sender has a key to lock_id
  _checkaccess(admin, lock_id);

  
  // Modify the lock table entry, removing the target from the lock.admins vector
  _locks.modify(lock, admin, [&](auto& modified_lock) { // admin is paying for the storage
    //struct lock& modified_lock_detials = modified_lock.lock_details;
    //vector<name>& admins = modified_lock_detials.admins;
    //admins.insert(admins.end(), recipient);

    // TODO validation should happen first so semi "transactional" in nature

    // update the users table appropriately
    _removeLockFromUser(admin, target, lock_id);

    // update the locks table appropriately
    _removeUserFromLock(modified_lock.lock_details, target);
  });
}

// Maybe want to make this 'logaccess'? so makes more sense to gatekeep...? but then wouldn't really be right either. can log before checking permissions.
ACTION eosacl::checkaccess(name username, uint8_t lock_id) {
  require_auth(get_self()); // could do this but then *only* this contract owner could use (restrict to me and my frontend) otherwise could be abused...
  _checkaccess(username, lock_id);
}

void eosacl::_checkaccess(name username, uint8_t lock_id) {
  print ("checking if ", name{username}, " has access to ", uint8_t{lock_id});

  // get the lock from the _locks table
  auto& user = _users.get(username.value, "user is not had a key shared with, not in dapp yet.");

  // check if the lock_id is found in the user's lock_id vector
  auto itr = std::find(user.lock_ids.begin(), user.lock_ids.end(), lock_id);
  //string message = string("user does not have a key to lock_id") + string ((char*)lock_id);
  string message = "user does not have a key to lock_id";
  check(itr != user.lock_ids.end(), message);
    
  // need to chekc the locks table as well?? shouldn't really but maybe should?
}

void eosacl::_addUserToLock(lock& lock_detail, name& user) {
  // add user to the admins list on the lock
 _addUserToAdminsVector(lock_detail.admins, user);
}

void eosacl::_addLockToUser(name sender, name user, uint8_t lock_id) {
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

void eosacl::_addUserToAdminsVector(vector<name>& admins, name& user) {
  admins.insert(admins.end(), user);
}

void eosacl::_removeUserFromLock(lock& lock_detail, name& user) {
  // add user to the admins list on the lock
  _removeUserFromAdminsVector(lock_detail.admins, user);
}

void eosacl::_removeLockFromUser(name admin, name user, uint8_t lock_id) {
  // Find the user the _users table
  auto user_itr = _users.find(user.value);

  check(user_itr != _users.end(), "user not found in _users table");

  // Modify a user record if it exists
  _users.modify(user_itr, admin, [&](auto& modified_user) { // admin or user? admin pays... so admin?
    _removeLockIdFromLockIdVector(modified_user.lock_ids, lock_id);
  });
  
}

void eosacl::_removeLockIdFromLockIdVector(vector<uint8_t>& lock_ids, uint8_t lock_id) {
  //find the lock_id in the user's lock_ids vector
  int lock_id_i_found = -1;
  for (int lock_i = 0; lock_i < lock_ids.size(); lock_i++) { 
    auto lock_id_from_vector = lock_ids[lock_i];

    if (lock_id == lock_id_from_vector) {
      lock_id_i_found = lock_i;
      break;
    }
  }

  //check(condition, "error message.");
  check(lock_id_i_found != -1, "user was not part of admins list");

  lock_ids.erase(lock_ids.begin() + lock_id_i_found); // need to get the iterate at the begining of the vector then just add the index to get where we want to be
}

void eosacl::_removeUserFromAdminsVector(vector<name>& admins, name& user) {

  //find the user in the admins vector
  int admin_i_found = -1;
  for (int admin_i = 0; admin_i < admins.size(); admin_i++) { 
    auto admin = admins[admin_i];

    if (admin.value == user.value) {
      admin_i_found = admin_i;
      break;
    }
  }

  //check(condition, "error message.");
  check(admin_i_found != -1, "user was not part of admins list");

  admins.erase(admins.begin() + admin_i_found); // need to get the iterate at the begining of the vector then just add the index to get where we want to be
}

/*
void eosacl::eraseLock(lock& lock_detail, name& user) {
    // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exsist");

  // need to verify sender has a key to lock_id
  checkaccess(admin, lock_id);
}
*/

EOSIO_DISPATCH(eosacl, (claimlock)(sharekey)(checkaccess)(revokekey))
