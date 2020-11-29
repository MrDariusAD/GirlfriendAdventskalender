using System;

namespace GirlfriendAdventskalender.Domain.Models {
    public class DoorContent {
        public string Id{ get; set; }
        public DateTime UnlocksAt { get; set; }
        public string ImageUrl{ get; set; }
        public string Text{ get; set; }

        public Contracts.Models.DoorContent AsContract() {
            return new Contracts.Models.DoorContent {
                Id = Id,
                ImageUrl = ImageUrl,
                Text = Text,
                UnlocksAt = UnlocksAt
            };
        }
    }
}
