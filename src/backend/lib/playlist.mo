import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Types "../types/playlist";

module {
  public type Channel = Types.Channel;
  public type ChannelId = Types.ChannelId;
  public type ChannelInput = Types.ChannelInput;
  public type ChannelUpdate = Types.ChannelUpdate;
  public type ReorderEntry = Types.ReorderEntry;

  module Channel {
    public func compare(a : Types.Channel, b : Types.Channel) : Order.Order {
      Nat.compare(a.order, b.order)
    };
  };

  // Returns all channels sorted by order field
  public func listChannels(
    channels : Map.Map<ChannelId, Channel>
  ) : [Channel] {
    let arr = channels.values().toArray();
    arr.sort()
  };

  // Returns a single channel by id
  public func getChannel(
    channels : Map.Map<ChannelId, Channel>,
    id : ChannelId
  ) : ?Channel {
    channels.get(id)
  };

  // Adds a new channel; returns the newly assigned id
  public func addChannel(
    channels : Map.Map<ChannelId, Channel>,
    nextId : Nat,
    input : ChannelInput
  ) : ChannelId {
    let newChannel : Channel = {
      id = nextId;
      name = input.name;
      group = input.group;
      url = input.url;
      logo = input.logo;
      userAgent = input.userAgent;
      order = input.order;
    };
    channels.add(nextId, newChannel);
    nextId
  };

  // Updates an existing channel; returns false if not found
  public func updateChannel(
    channels : Map.Map<ChannelId, Channel>,
    update : ChannelUpdate
  ) : Bool {
    switch (channels.get(update.id)) {
      case null { false };
      case (?_) {
        let updated : Channel = {
          id = update.id;
          name = update.name;
          group = update.group;
          url = update.url;
          logo = update.logo;
          userAgent = update.userAgent;
          order = update.order;
        };
        channels.add(update.id, updated);
        true
      };
    }
  };

  // Deletes a channel by id; returns false if not found
  public func deleteChannel(
    channels : Map.Map<ChannelId, Channel>,
    id : ChannelId
  ) : Bool {
    switch (channels.get(id)) {
      case null { false };
      case (?_) {
        channels.remove(id);
        true
      };
    }
  };

  // Bulk reorder: applies new order values for the given channel ids
  public func reorderChannels(
    channels : Map.Map<ChannelId, Channel>,
    entries : [ReorderEntry]
  ) : () {
    for (entry in entries.values()) {
      switch (channels.get(entry.id)) {
        case null {};
        case (?ch) {
          channels.add(entry.id, { ch with order = entry.order });
        };
      };
    };
  };

  // Replaces the entire channel list with the provided channels; returns new count
  public func importChannels(
    channels : Map.Map<ChannelId, Channel>,
    nextId : Nat,
    inputs : [ChannelInput]
  ) : Nat {
    channels.clear();
    var currentId = nextId;
    for (input in inputs.values()) {
      let newChannel : Channel = {
        id = currentId;
        name = input.name;
        group = input.group;
        url = input.url;
        logo = input.logo;
        userAgent = input.userAgent;
        order = input.order;
      };
      channels.add(currentId, newChannel);
      currentId += 1;
    };
    inputs.size()
  };

  // Removes all channels
  public func clearChannels(
    channels : Map.Map<ChannelId, Channel>
  ) : () {
    channels.clear();
  };
};
