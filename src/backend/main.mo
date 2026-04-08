import Map "mo:core/Map";
import Types "types/playlist";
import PlaylistMixin "mixins/playlist-api";

actor {
  let channels = Map.empty<Types.ChannelId, Types.Channel>();

  include PlaylistMixin(channels);
};
