using _2380614489_NguyenHoTheAnh_TH6.Models;

namespace _2380614489_NguyenHoTheAnh_TH6.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> AddAsync(Product product);
        Task<Product?> UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
