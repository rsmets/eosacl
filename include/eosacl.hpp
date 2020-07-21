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
    ACTION sharekey(name sender, name recipient, uint8_t lock_id, uint8_t role);
    ACTION revokekey(name admin, name target, uint8_t lock_id);
    ACTION logaccess(name username, uint8_t lock_id, uint8_t role);
    ACTION checkaccess(name username, uint8_t lock_id, uint8_t role);

  private:

    enum role: uint8_t {
      USER = 10,
      ADMIN = 20
    };

    struct lock { // 1 byte + (8 byte * admin_count)
      uint8_t  lock_id; // 1 byte
      vector<name> admins = {}; //(8 byte * admin_count)
      vector<name> users = {}; //(8 byte * admin_count)
    };

    TABLE lock_info { // 1 byte + ( 1 byte + (8 byte * admin_count) )
      uint8_t  lock_id; // 1 byte
      struct lock lock_details; //( 1 byte + (8 byte * admin_count) )
      auto primary_key() const { return lock_id; }; 
    };
    typedef multi_index<name("locks"), lock_info> locks_table;

    locks_table _locks;

    TABLE user_info { // 8 bytes + ( 1 byte * lock_ids_count )
      name  username; // 8 bytes
      //user user_details;
      vector<uint8_t> lock_ids = {}; // ( 1 byte * lock_ids_count )
      vector<uint8_t> access_only_lock_ids = {}; // USER level keys // ( 1 byte * lock_ids_count )
      auto primary_key() const { return username.value; }; 
    };
    typedef multi_index<name("users"), user_info> users_table;

    users_table _users;

    void _checkaccess(name username, uint8_t lock_id, uint8_t role);
    void _checkUserLevelAccess(user_info user, uint8_t lock_id);
    void _checkAdminLevelAccess(user_info user, uint8_t lock_id);

    void _addUserToLock(lock& lock_detail, name& user, uint8_t role);
    void _addLockToUser(name sender, name user, uint8_t lock_id, uint8_t role);
    void _addUserToVector(vector<name>& persons, name& user);
    
    bool _removeUserFromLock(lock& lock_detail, name& user);
    bool _removeLockFromUser(name admin, name user, uint8_t lock_id);
    bool _removeUserFromVector(vector<name>& admins, name& user);
    bool _removeLockIdFromLockIdVector(vector<uint8_t>& lock_ids, uint8_t lock_id);

    string _convertLockIdToString(uint8_t* lockId);
};
