namespace MinhaApi.Models;
public class Venda
{
    public int Id {get; set;}

    public int Id_Produto {get; set;}

    public int Id_Cliente {get; set;}

    public DateTime Data_Venda {get; set;}

    public decimal Valor_Unitario {get; set;}

    public int Quantidade {get; set;}

    public decimal Total_Venda {get; set;}

}