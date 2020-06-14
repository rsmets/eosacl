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
    ACTION checkaccess(name username, uint8_t lock_id);

  private:

    struct lock {
      uint8_t  lock_id;
      vector<name> admins = {};

      //lock (name user) : admins.insert(admins.begin(), user){}
    };

    void addUserToLock(lock& lock_detail, name& user);
    void addUserToAdminsVector(vector<name>& admins, name& user);
    void addLockToUser(name sender, name user, uint8_t lock_id);

    TABLE lock_info {
      uint8_t  lock_id;
      struct lock lock_details;
      auto primary_key() const { return lock_id; };
    };
    typedef multi_index<name("locks"), lock_info> locks_table;

    locks_table _locks;

// NOT SURE THIS IS NEEDED?....
    struct user {
      name  username;
      vector<uint8_t> lock_ids = {};
    };

    TABLE user_info {
      name  username;
      //user user_details;
      vector<uint8_t> lock_ids = {};
      auto primary_key() const { return username.value; };
    };
    typedef multi_index<name("users"), user_info> users_table;

    users_table _users;
};
