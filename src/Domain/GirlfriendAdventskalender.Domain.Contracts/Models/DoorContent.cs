using System;

namespace GirlfriendAdventskalender.Domain.Contracts.Models {
    public class DoorContent {
        public string Id{ get; set; }
        public DateTime UnlocksAt { get; set; }
        public string ImageUrl { get; set; }
        public string Text { get; set; }
    }
}
