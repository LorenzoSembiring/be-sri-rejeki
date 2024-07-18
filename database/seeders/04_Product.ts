import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from 'App/Models/Product'

export default class extends BaseSeeder {
  public async run () {
    await Product.createMany([
      {
        name: "Blangkon Jogja Motif Batik Parang",
        description: "<p><strong>Blangkon Jogja Motif Batik Parang</strong></p><p><strong>Deskripsi Produk:</strong></p><p>Blangkon Jogja Motif Batik Parang adalah aksesori tradisional yang elegan, terbuat dari bahan berkualitas tinggi dan dirancang dengan motif batik parang yang khas. Blangkon ini adalah simbol keanggunan dan budaya Jawa yang sarat makna.</p><p><strong>Fitur Utama:</strong></p><ul><li><strong>Motif Batik Parang:</strong> Motif batik parang adalah salah satu motif batik paling populer dan memiliki makna filosofis mendalam, melambangkan keberanian, keuletan, dan kesinambungan.</li><li><strong>Kualitas Premium:</strong> Dibuat dari bahan kain terbaik yang nyaman dipakai dan tahan lama.</li><li><strong>Desain Otentik:</strong> Menggunakan teknik batik tradisional yang menjamin keaslian dan keindahan motif.</li></ul>",
        price: 100000,
        weight: 200,
        status: "ACTIVE",
        texture: "/uploads/texture/batik-parang.jpg",
        category_id: 1,
        mesh_id: 1
      },
      {
        name: "Blangkon Jawa Tengah Motif Batik Ceplok",
        description: "<p><strong>Blangkon Jawa Tengah Motif Batik Ceplok</strong></p><p><strong>Deskripsi Produk:</strong></p><p>Blangkon Jawa Tengah Motif Batik Ceplok adalah aksesori tradisional yang indah, dibuat dari bahan berkualitas tinggi dengan motif batik ceplok yang unik. Blangkon ini mencerminkan kekayaan budaya Jawa Tengah yang penuh keanggunan dan makna.</p><p><strong>Fitur Utama:</strong></p><ul><li><strong>Motif Batik Ceplok:</strong> Motif batik ceplok terkenal dengan pola simetrisnya yang indah, melambangkan harmoni dan keteraturan.</li><li><strong>Kualitas Terbaik:</strong> Dibuat dari bahan kain premium yang nyaman dipakai dan awet.</li><li><strong>Desain Asli:</strong> Menggunakan teknik batik tradisional yang mempertahankan keaslian dan keunikan motif.</li></ul>",
        price: 50000,
        weight: 200,
        status: "ACTIVE",
        texture: "/uploads/texture/ceplok.jpg",
        category_id: 2,
        mesh_id: 1
      },
      {
        name: "Blangkon Jogja Motif Batik Kawung",
        description: "<p><strong>Blangkon Jawa Tengah Motif Batik Kawung</strong></p><p><strong>Deskripsi Produk:</strong></p><p>Blangkon Jawa Tengah Motif Batik Ceplok adalah aksesori tradisional yang indah, dibuat dari bahan berkualitas tinggi dengan motif batik ceplok yang unik. Blangkon ini mencerminkan kekayaan budaya Jawa Tengah yang penuh keanggunan dan makna.</p><p><strong>Fitur Utama:</strong></p><ul><li><strong>Motif Batik Ceplok:</strong> Motif batik ceplok terkenal dengan pola simetrisnya yang indah, melambangkan harmoni dan keteraturan.</li><li><strong>Kualitas Terbaik:</strong> Dibuat dari bahan kain premium yang nyaman dipakai dan awet.</li><li><strong>Desain Asli:</strong> Menggunakan teknik batik tradisional yang mempertahankan keaslian dan keunikan motif.</li></ul>",
        price: 50000,
        weight: 200,
        status: "ACTIVE",
        texture: "/uploads/texture/kawung.jpg",
        category_id: 1,
        mesh_id: 1
      },
    ])
  }
}
