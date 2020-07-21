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
  _addLockToUser(owner, owner, lock_id, ADMIN);
}

ACTION eosacl::sharekey(name sender, name recipient, uint8_t lock_id, uint8_t role) {
  require_auth(sender);

  print ("Attempting to send ", name{recipient}, " a key to ", uint8_t{lock_id}, ". ");

  // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exist");

  // need to verify sender has an admin key to lock_id
  _checkaccess(sender, lock_id, ADMIN);

  // Modify the lock table entry, adding the recipient to the lock.admins vector
  _locks.modify(lock, sender, [&](auto& modified_lock) { // sender is paying for the storage
    //struct lock& modified_lock_detials = modified_lock.lock_details;
    //vector<name>& admins = modified_lock_detials.admins;
    //admins.insert(admins.end(), recipient);

    // update the lock table lock's entry with the new user, making the sender pay for it
    _addUserToLock(modified_lock.lock_details, recipient, role);
    
    // update the user table user's entry with the new key, making the sender pay for it
    _addLockToUser(sender, recipient, lock_id, role);
  });
}

ACTION eosacl::revokekey(name admin, name target, uint8_t lock_id) {
  require_auth(admin);

  // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exist");

  // get the user from the _users table
  auto& user = _users.get(target.value, "user does not exist");

  // need to verify sender has an admin key to lock_id
  _checkaccess(admin, lock_id, ADMIN);

  
  // Modify the lock table entry, removing the target from the lock.admins vector
  _locks.modify(lock, admin, [&](auto& modified_lock) { // admin is paying for the storage

    // TODO validation should happen first so semi "transactional" in nature

    // update the users table appropriately
    bool revokeLockFromUserSuccess = _removeLockFromUser(admin, target, lock_id);

    // update the locks table appropriately
    bool revokeUserFromLockSuccess = _removeUserFromLock(modified_lock.lock_details, target);
    
    check((revokeLockFromUserSuccess && revokeUserFromLockSuccess), "Attempted to revoke " + target.to_string() + " key from " + _convertLockIdToString(&lock_id) + " failed. They did not have a key. ");

    if (revokeLockFromUserSuccess && revokeUserFromLockSuccess) {
      print ("Attempted to revoke ", name{target}, " key from ", uint8_t{lock_id}, " success! ");
    } else {
      print ("Attempted to revoke ", name{target}, " key from ", uint8_t{lock_id}, " resulted in odd outcome. Something is not right. ");
    }
  });
}

ACTION eosacl::logaccess(name username, uint8_t lock_id, uint8_t role) {
  require_auth(username); // the account logging access needs to have the authority to do so!
  _checkaccess(username, lock_id, role);
}

ACTION eosacl::checkaccess(name username, uint8_t lock_id, uint8_t role) {
  // require_auth(get_self()); // could do this but then *only* this contract owner could use (restrict to me and my frontend)
  // require_auth(username); // the account logging access needs to have the authority to do so!
  _checkaccess(username, lock_id, role);
}

void eosacl::_checkaccess(name username, uint8_t lock_id, uint8_t role) {
  check(role == USER || role == ADMIN, "role input invalid");
  // print ("Checking if ", name{username}, " has ", uint8_t{role} ," access to lock ", uint8_t{lock_id}, ". \n");
  if (role == ADMIN)
    print ("Checking if ", name{username}, " has Admin access to lock ", uint8_t{lock_id}, ". \n");
  else //(role == USER)
    print ("Checking if ", name{username}, " has User access to lock ", uint8_t{lock_id}, ". \n");
    
  
  // get the lock from the _locks table
  auto& user = _users.get(username.value, "user is not had a key shared with, not in dapp yet.");
  // & ??  worked with the & before
  if (role == ADMIN) {
    _checkAdminLevelAccess(user, lock_id);
  } else { // role == USER
    _checkUserLevelAccess(user, lock_id);
  }
    
  // need to check the locks table as well?? shouldn't really but maybe should?
  print (" Access verified.");
}

void eosacl::_checkAdminLevelAccess(user_info user, uint8_t lock_id) {
  // check if the lock_id is found in the user's lock_id vector
  auto itr = std::find(user.lock_ids.begin(), user.lock_ids.end(), lock_id);
  //string message = string("user does not have a key to lock_id") + string ((char*)lock_id);
  string message = "user does not have a key to lock_id";
  check(itr != user.lock_ids.end(), message);
    
  // need to check the locks table as well?? shouldn't really but maybe should?
}

void eosacl::_checkUserLevelAccess(user_info user, uint8_t lock_id) {
  // check if the lock_id is found in the user's lock_id vector
  auto itr = std::find(user.access_only_lock_ids.begin(), user.access_only_lock_ids.end(), lock_id);
  //string message = string("user does not have a key to lock_id") + string ((char*)lock_id);
  string message = "user does not have a key to lock_id";
  check(itr != user.access_only_lock_ids.end(), message);
    
  // need to check the locks table as well?? shouldn't really but maybe should?
}

void eosacl::_addUserToLock(lock& lock_detail, name& user, uint8_t role) {
  if (role == ADMIN) {
    // add user to the admins list on the lock
    _addUserToVector(lock_detail.admins, user);
  } else {
        // add user to the user list on the lock
    _addUserToVector(lock_detail.users, user);
  }
}

void eosacl::_addLockToUser(name sender, name user, uint8_t lock_id,  uint8_t role) {
  // Find the user the _users table
  auto user_itr = _users.find(user.value);
  
  if (user_itr == _users.end()) {
    // create a new lock in entry in the _locks table
    _users.emplace(sender, [&](auto& new_user) { // sender is paying for the storage of this
      
      new_user.username = user;
      if (role == ADMIN) {
        new_user.lock_ids = {lock_id};
      } else {
        new_user.access_only_lock_ids = {lock_id};
      }
      
    });
  } else {
    // Modify a user record if it exists
    _users.modify(user_itr, sender, [&](auto& modified_user) { // sender is playing to update the user's key chain
      if (role == ADMIN) {
        modified_user.lock_ids.insert(modified_user.lock_ids.end(), lock_id);
      } else {
        modified_user.access_only_lock_ids.insert(modified_user.access_only_lock_ids.end(), lock_id);
      }
    });
  }
}

void eosacl::_addUserToVector(vector<name>& persons, name& user) {
  persons.insert(persons.end(), user);
}

bool eosacl::_removeUserFromLock(lock& lock_detail, name& user) {
  // remove user to the admins and user list on the lock
  bool adminRevoke = _removeUserFromVector(lock_detail.admins, user);
  bool userRevoke = _removeUserFromVector(lock_detail.users, user);

  return adminRevoke || userRevoke;
}

bool eosacl::_removeLockFromUser(name admin, name user, uint8_t lock_id) {
  // Find the user the _users table
  auto user_itr = _users.find(user.value);

  check(user_itr != _users.end(), "user not found in _users table");

  bool removeUserAdminKey = false;
  bool removeUserAccessOnlyKey = false;

  // Modify a user record if it exists
  _users.modify(user_itr, admin, [&](auto& modified_user) { // admin or user? admin pays... so admin?
    removeUserAdminKey = _removeLockIdFromLockIdVector(modified_user.lock_ids, lock_id);
    removeUserAccessOnlyKey = _removeLockIdFromLockIdVector(modified_user.access_only_lock_ids, lock_id);
  });
  
  return removeUserAdminKey || removeUserAccessOnlyKey;
}

bool eosacl::_removeLockIdFromLockIdVector(vector<uint8_t>& lock_ids, uint8_t lock_id) {
  //find the lock_id in the user's lock_ids vector
  int lock_id_i_found = -1;
  for (int lock_i = 0; lock_i < lock_ids.size(); lock_i++) { 
    auto lock_id_from_vector = lock_ids[lock_i];

    if (lock_id == lock_id_from_vector) {
      lock_id_i_found = lock_i;
      break;
    }
  }

  // check(condition, "error message.");
  // check(lock_id_i_found != -1, "user was not part of admins list");
  if (lock_id_i_found != -1) {
    lock_ids.erase(lock_ids.begin() + lock_id_i_found); // need to get the iterate at the begining of the vector then just add the index to get where we want to be
    return true;
  } 

  return false;
}

bool eosacl::_removeUserFromVector(vector<name>& admins, name& user) {

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
  // check(admin_i_found != -1, "user was not part of admins list");
  if (admin_i_found != -1) {
    admins.erase(admins.begin() + admin_i_found); // need to get the iterate at the begining of the vector then just add the index to get where we want to be
    return true;
  }
  
  return false;
}

string eosacl::_convertLockIdToString(uint8_t* lockId) {
  return string((char *)lockId);
}

/* TODO
void eosacl::eraseLock(lock& lock_detail, name& user) {
    // get the lock from the _locks table
  auto& lock = _locks.get(lock_id, "lock does not exsist");

  // need to verify sender has a key to lock_id
  checkaccess(admin, lock_id);
}
*/

EOSIO_DISPATCH(eosacl, (claimlock)(sharekey)(logaccess)(checkaccess)(revokekey))
