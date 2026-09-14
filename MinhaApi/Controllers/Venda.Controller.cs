using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;


[ApiController]
[Route("api/[controller]")]
public class VendaController : ControllerBase
{
    private readonly IVendaService _service;

    public VendaController(IVendaService service)
        => _service = service;

    //GET / api/produto
    [HttpGet]
    public IActionResult GetAll()
    {
        var venda = _service.GetAll();
        return Ok(venda);
    }

     [HttpPost]
    public IActionResult Create([FromBody] Produto produto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var criado = _service.Create(produto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = criado.Id },
            criado);
    }

        // GET /api/venda
    [HttpGet]
    public IActionResult GetAll()
    {
        var venda = _service.GetAll();
        return Ok(venda);
    }

    // GET /api/venda/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var venda = _service.GetById(id);
        if (venda == null)
            return NotFound();

        return Ok(venda);
    }


}