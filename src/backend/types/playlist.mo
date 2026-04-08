import Common "common";

module {
  public type ChannelId = Common.ChannelId;

  // Shared (API boundary) type — no var fields
  public type Channel = {
    id : ChannelId;
    name : Text;
    group : Text;
    url : Text;
    logo : Text;
    userAgent : Text;
    order : Nat;
  };

  // Input type for creating or importing a channel (no id required)
  public type ChannelInput = {
    name : Text;
    group : Text;
    url : Text;
    logo : Text;
    userAgent : Text;
    order : Nat;
  };

  // Input type for updating a channel (id required)
  public type ChannelUpdate = {
    id : ChannelId;
    name : Text;
    group : Text;
    url : Text;
    logo : Text;
    userAgent : Text;
    order : Nat;
  };

  // Bulk reorder entry: channel id + new order value
  public type ReorderEntry = {
    id : ChannelId;
    order : Nat;
  };
};
