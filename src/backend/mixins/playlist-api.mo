import Map "mo:core/Map";
import PlaylistLib "../lib/playlist";
import Types "../types/playlist";

mixin (
  channels : Map.Map<Types.ChannelId, Types.Channel>
) {

  var nextChannelId : Nat = 1;

  // Returns all channels ordered by their order field
  public query func listChannels() : async [Types.Channel] {
    PlaylistLib.listChannels(channels)
  };

  // Returns a single channel by id, or null if not found
  public query func getChannel(id : Types.ChannelId) : async ?Types.Channel {
    PlaylistLib.getChannel(channels, id)
  };

  // Adds a new channel and returns its assigned id
  public func addChannel(input : Types.ChannelInput) : async Types.ChannelId {
    let id = PlaylistLib.addChannel(channels, nextChannelId, input);
    nextChannelId += 1;
    id
  };

  // Updates an existing channel; returns false if the channel was not found
  public func updateChannel(update : Types.ChannelUpdate) : async Bool {
    PlaylistLib.updateChannel(channels, update)
  };

  // Deletes a channel by id; returns false if not found
  public func deleteChannel(id : Types.ChannelId) : async Bool {
    PlaylistLib.deleteChannel(channels, id)
  };

  // Bulk-updates order values for multiple channels
  public func reorderChannels(entries : [Types.ReorderEntry]) : async () {
    PlaylistLib.reorderChannels(channels, entries)
  };

  // Replaces the entire channel list with the imported channels; returns new total count
  public func importChannels(inputs : [Types.ChannelInput]) : async Nat {
    let count = PlaylistLib.importChannels(channels, nextChannelId, inputs);
    nextChannelId += inputs.size();
    count
  };

  // Removes all channels
  public func clearChannels() : async () {
    PlaylistLib.clearChannels(channels)
  };
};
