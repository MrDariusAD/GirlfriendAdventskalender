using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using GirlfriendAdventskalender.Domain.Contracts.Models;
using GirlfriendAdventskalender.Domain.Repositories;

namespace GirlfriendAdventskalender.Presentation.WebApi.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class DoorContentController : ControllerBase {
        private readonly IDoorContentRepository _repository;

        public DoorContentController(IDoorContentRepository repository) {
            _repository = repository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoorContent(string id) {
            return Ok(await _repository.Load(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDoorContents() {
            return Ok(await _repository.LoadAll());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CreateDoorContent([FromBody] DoorContent doorContent, string id) {
            return Ok(await _repository.Save(new Domain.Models.DoorContent {
                Id = id,
                ImageUrl = doorContent.ImageUrl,
                Text = doorContent.Text,
                UnlocksAt = doorContent.UnlocksAt
            }));
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> EditDoorContent([FromBody] DoorContent doorContent, string id) {
            return Ok(await _repository.Edit(new Domain.Models.DoorContent {
                Id = id,
                ImageUrl = doorContent.ImageUrl,
                Text = doorContent.Text,
                UnlocksAt = doorContent.UnlocksAt
            }));
        }
    }
}
