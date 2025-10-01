export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Ambil semua tamu
    if (url.pathname === "/api/tamu" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM tamu ORDER BY id DESC").all();
      return Response.json(results);
    }

    // Ambil data tamu by ID
    if (url.pathname.startsWith("/api/tamu/")) {
      const id = url.pathname.split("/").pop();
      const tamu = await env.DB.prepare("SELECT * FROM tamu WHERE id = ?").bind(id).first();
      return Response.json(tamu || {});
    }

    // Tambah tamu (opsional kalau admin mau input manual)
    if (url.pathname === "/api/tamu" && request.method === "POST") {
      const data = await request.json();
      await env.DB.prepare("INSERT INTO tamu (nama, alamat, telepon, jumlah) VALUES (?, ?, ?, ?)")
        .bind(data.nama, data.alamat, data.telepon, data.jumlah)
        .run();
      return Response.json({ success: true });
    }

    // Check-in update hadir
    if (url.pathname === "/api/checkin" && request.method === "POST") {
      const data = await request.json();
      await env.DB.prepare("UPDATE tamu SET hadir = 1 WHERE id = ?").bind(data.id).run();
      return Response.json({ success: true });
    }

    return new Response("Not found", { status: 404 });
  }
};
