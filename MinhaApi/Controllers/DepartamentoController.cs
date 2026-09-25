using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;


[ApiController]
[Route("api/[controller]")]
public class DepartamentoController : ControllerBase
{
    private readonly IDepartamentoService _service;

    public DepartamentoController(IDepartamentoService service)
    => _service = service;

    //GET / api/produto
    [HttpGet]
    public IActionResult GetAll()
    {
        var departamento = _service.GetAll();
        return Ok(departamento);
    }

// GET /api/produto/1
    [HttpGet("id")]
    public IActionResult GetById(int id)
    {
        var departamento = _service.GetById(id);
        if (departamento == null)
            return NotFound();
        return Ok(departamento);
    }

// POST /api/produto
    [HttpPost]
    public IActionResult Create([FromBody] Departamento departamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var criado = _service.Create(departamento);

        return CreatedAtAction(
            nameof(GetById),
            new { id = departamento.Id },
            criado);
    }
// PUT /api/produto/1
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Departamento departamento)
    {
        var atualizado = _service.Update(id, departamento);

        if (atualizado == null)
            return NotFound();

        return Ok(atualizado);
    }

// DELETE /api/produto/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id, Fornecedor f)
    {
        var deletado = _service.Delete(id, f);

        if (!deletado)
            return NotFound();

        return NoContent();
    }    
}