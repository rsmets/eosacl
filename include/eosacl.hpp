#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT eosacl : public contract {
  public:
    using contract::contract;

    eosacl(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds),
    _locks(receiver, receiver.value),
    _users(receiver, receiver.value)
    {}

    ACTION claimlock(name owner, uint8_t lock_id);
    ACTION sharekey(name sender, name recipient, uint8_t lock_id);
    ACTION revokekey(name admin, name target, uint8_t lock_id);
    ACTION checkaccess(name username, uint8_t lock_id);

  private:

    struct lock { // 1 byte + (8 byte * admin_count)
      uint8_t  lock_id; // 1 byte
      vector<name> admins = {}; //(8 byte * admin_count)

      //lock (name user) : admins.insert(admins.begin(), user){}
    };

    void _checkaccess(name username, uint8_t lock_id);
    void addUserToLock(lock& lock_detail, name& user);
    void addUserToAdminsVector(vector<name>& admins, name& user);
    void addLockToUser(name sender, name user, uint8_t lock_id);
    
    void removeUserFromLock(lock& lock_detail, name& user);
    void removeUserFromAdminsVector(vector<name>& admins, name& user);
    void removeLockFromUser(name admin, name user, uint8_t lock_id);
    void removeLockIdFromLockIdVector(vector<uint8_t>& lock_ids, uint8_t lock_id);

    TABLE lock_info { // 1 byte + ( 1 byte + (8 byte * admin_count) )
      uint8_t  lock_id; // 1 byte
      struct lock lock_details; //( 1 byte + (8 byte * admin_count) )
      auto primary_key() const { return lock_id; }; 
    };
    typedef multi_index<name("locks"), lock_info> locks_table;

    locks_table _locks;

// NOT SURE THIS IS NEEDED?....
    struct user {
      name  username;
      vector<uint8_t> lock_ids = {};
    };

    TABLE user_info { // 8 bytes + ( 1 byte * lock_ids_count )
      name  username; // 8 bytes
      //user user_details;
      vector<uint8_t> lock_ids = {}; // ( 1 byte * lock_ids_count )
      auto primary_key() const { return username.value; }; 
    };
    typedef multi_index<name("users"), user_info> users_table;

    users_table _users;
};
