const conexao = require('../database/conexao');

// Lista todas as musicas com os dados completos (JOIN nas tabelas relacionadas)
async function listar(req, res) {
  const { busca, genero } = req.query;

  try {
    let sql = `
      SELECT 
        m.id,
        t.titulo,
        a.artista,
        al.album,
        g.genero,
        TO_CHAR(d.datalancamento, 'YYYY-MM-DD') AS datalancamento,
        TO_CHAR(d.datalancamento, 'DD/MM/YYYY') AS datalancamento_formatada,
        de.descricao,
        m.capa_url
      FROM musicas m
      LEFT JOIN titulos t ON m.tituloid = t.id
      LEFT JOIN artistas a ON m.artistaid = a.id
      LEFT JOIN albuns al ON m.albumid = al.id
      LEFT JOIN generos g ON m.generoid = g.id
      LEFT JOIN datalancamentos d ON m.datalancamentoid = d.id
      LEFT JOIN descricoes de ON m.descricaoid = de.id
      WHERE 1=1
    `;

    const parametros = [];

    if (busca) {
      parametros.push(`%${busca}%`);
      sql += ` AND (t.titulo ILIKE $${parametros.length} OR a.artista ILIKE $${parametros.length} OR al.album ILIKE $${parametros.length})`;
    }

    if (genero && genero !== 'Todos') {
      parametros.push(genero);
      sql += ` AND g.genero ILIKE $${parametros.length}`;
    }

    sql += ` ORDER BY m.id DESC`;

    const resultado = await conexao.query(sql, parametros);
    return res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao listar musicas:', erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar musicas.' });
  }
}

// Busca uma musica especifica pelo ID
async function buscarPorId(req, res) {
  const { id } = req.params;

  try {
    const sql = `
      SELECT 
        m.id,
        t.titulo,
        a.artista,
        al.album,
        g.genero,
        TO_CHAR(d.datalancamento, 'YYYY-MM-DD') AS datalancamento,
        TO_CHAR(d.datalancamento, 'DD/MM/YYYY') AS datalancamento_formatada,
        de.descricao,
        m.capa_url
      FROM musicas m
      LEFT JOIN titulos t ON m.tituloid = t.id
      LEFT JOIN artistas a ON m.artistaid = a.id
      LEFT JOIN albuns al ON m.albumid = al.id
      LEFT JOIN generos g ON m.generoid = g.id
      LEFT JOIN datalancamentos d ON m.datalancamentoid = d.id
      LEFT JOIN descricoes de ON m.descricaoid = de.id
      WHERE m.id = $1
    `;

    const resultado = await conexao.query(sql, [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Musica nao encontrada.' });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao buscar musica por id:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao buscar detalhes da musica.' });
  }
}

// Cadastra uma nova musica inserindo nas tabelas do modelo
async function cadastrar(req, res) {
  const { titulo, artista, album, genero, datalancamento, descricao, capa_url } = req.body;

  if (!titulo || !artista) {
    return res.status(400).json({ mensagem: 'Titulo e artista sao campos obrigatorios.' });
  }

  try {
    // 1. Título
    const resTitulo = await conexao.query(
      'INSERT INTO titulos (titulo) VALUES ($1) RETURNING id',
      [titulo]
    );
    const tituloid = resTitulo.rows[0].id;

    // 2. Artista
    const resArtista = await conexao.query(
      'INSERT INTO artistas (artista) VALUES ($1) RETURNING id',
      [artista]
    );
    const artistaid = resArtista.rows[0].id;

    // 3. Álbum
    const resAlbum = await conexao.query(
      'INSERT INTO albuns (album) VALUES ($1) RETURNING id',
      [album || 'Single']
    );
    const albumid = resAlbum.rows[0].id;

    // 4. Gênero
    let generoid = null;
    if (genero) {
      const resBuscaGen = await conexao.query('SELECT id FROM generos WHERE genero ILIKE $1', [genero]);
      if (resBuscaGen.rowCount > 0) {
        generoid = resBuscaGen.rows[0].id;
      } else {
        const resNovoGen = await conexao.query('INSERT INTO generos (genero) VALUES ($1) RETURNING id', [genero]);
        generoid = resNovoGen.rows[0].id;
      }
    }

    // 5. Data de lançamento
    let datalancamentoid = null;
    if (datalancamento) {
      const resData = await conexao.query(
        'INSERT INTO datalancamentos (datalancamento) VALUES ($1) RETURNING id',
        [datalancamento]
      );
      datalancamentoid = resData.rows[0].id;
    }

    // 6. Descrição
    let descricaoid = null;
    if (descricao) {
      const resDesc = await conexao.query(
        'INSERT INTO descricoes (descricao) VALUES ($1) RETURNING id',
        [descricao]
      );
      descricaoid = resDesc.rows[0].id;
    }

    // 7. Registro principal na tabela musicas
    const capaPadrao = capa_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop';
    const novaMusica = await conexao.query(
      `INSERT INTO musicas (tituloid, artistaid, albumid, generoid, datalancamentoid, descricaoid, capa_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [tituloid, artistaid, albumid, generoid, datalancamentoid, descricaoid, capaPadrao]
    );

    return res.status(201).json({
      mensagem: 'Musica cadastrada com sucesso!',
      id: novaMusica.rows[0].id
    });
  } catch (erro) {
    console.error('Erro ao cadastrar musica:', erro);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar musica no banco de dados.' });
  }
}

// Atualiza os dados de uma musica existente
async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, artista, album, genero, datalancamento, descricao, capa_url } = req.body;

  try {
    // Busca a musica para obter os IDs das tabelas relacionadas
    const busca = await conexao.query('SELECT * FROM musicas WHERE id = $1', [id]);
    if (busca.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Musica nao encontrada.' });
    }

    const m = busca.rows[0];

    // Atualiza titulo
    if (titulo && m.tituloid) {
      await conexao.query('UPDATE titulos SET titulo = $1 WHERE id = $2', [titulo, m.tituloid]);
    }

    // Atualiza artista
    if (artista && m.artistaid) {
      await conexao.query('UPDATE artistas SET artista = $1 WHERE id = $2', [artista, m.artistaid]);
    }

    // Atualiza album
    if (album && m.albumid) {
      await conexao.query('UPDATE albuns SET album = $1 WHERE id = $2', [album, m.albumid]);
    }

    // Atualiza ou insere genero
    if (genero) {
      let gid = m.generoid;
      const buscaGen = await conexao.query('SELECT id FROM generos WHERE genero ILIKE $1', [genero]);
      if (buscaGen.rowCount > 0) {
        gid = buscaGen.rows[0].id;
      } else {
        const novoGen = await conexao.query('INSERT INTO generos (genero) VALUES ($1) RETURNING id', [genero]);
        gid = novoGen.rows[0].id;
      }
      await conexao.query('UPDATE musicas SET generoid = $1 WHERE id = $2', [gid, id]);
    }

    // Atualiza data de lancamento
    if (datalancamento) {
      if (m.datalancamentoid) {
        await conexao.query('UPDATE datalancamentos SET datalancamento = $1 WHERE id = $2', [datalancamento, m.datalancamentoid]);
      } else {
        const novaData = await conexao.query('INSERT INTO datalancamentos (datalancamento) VALUES ($1) RETURNING id', [datalancamento]);
        await conexao.query('UPDATE musicas SET datalancamentoid = $1 WHERE id = $2', [novaData.rows[0].id, id]);
      }
    }

    // Atualiza descricao
    if (descricao !== undefined) {
      if (m.descricaoid) {
        await conexao.query('UPDATE descricoes SET descricao = $1 WHERE id = $2', [descricao, m.descricaoid]);
      } else {
        const novaDesc = await conexao.query('INSERT INTO descricoes (descricao) VALUES ($1) RETURNING id', [descricao]);
        await conexao.query('UPDATE musicas SET descricaoid = $1 WHERE id = $2', [novaDesc.rows[0].id, id]);
      }
    }

    // Atualiza capa
    if (capa_url) {
      await conexao.query('UPDATE musicas SET capa_url = $1 WHERE id = $2', [capa_url, id]);
    }

    return res.status(200).json({ mensagem: 'Musica atualizada com sucesso!' });
  } catch (erro) {
    console.error('Erro ao atualizar musica:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao atualizar dados da musica.' });
  }
}

// Exclui uma musica
async function excluir(req, res) {
  const { id } = req.params;

  try {
    const resultado = await conexao.query('DELETE FROM musicas WHERE id = $1 RETURNING id', [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Musica nao encontrada.' });
    }

    return res.status(200).json({ mensagem: 'Musica removida com sucesso!' });
  } catch (erro) {
    console.error('Erro ao excluir musica:', erro);
    return res.status(500).json({ mensagem: 'Erro ao excluir musica.' });
  }
}

// Estatisticas para a tela de Dashboard
async function estatisticas(req, res) {
  try {
    const totalMusicas = await conexao.query('SELECT COUNT(*) FROM musicas');
    const totalArtistas = await conexao.query('SELECT COUNT(DISTINCT artistaid) FROM musicas');
    const totalAlbuns = await conexao.query('SELECT COUNT(DISTINCT albumid) FROM musicas');

    // Músicas por gênero
    const porGenero = await conexao.query(`
      SELECT g.genero, COUNT(m.id) AS total
      FROM musicas m
      JOIN generos g ON m.generoid = g.id
      GROUP BY g.genero
      ORDER BY total DESC
    `);

    // Últimas cadastradas
    const ultimas = await conexao.query(`
      SELECT 
        m.id,
        t.titulo,
        a.artista,
        g.genero
      FROM musicas m
      LEFT JOIN titulos t ON m.tituloid = t.id
      LEFT JOIN artistas a ON m.artistaid = a.id
      LEFT JOIN generos g ON m.generoid = g.id
      ORDER BY m.id DESC
      LIMIT 5
    `);

    return res.status(200).json({
      totalMusicas: parseInt(totalMusicas.rows[0].count),
      totalArtistas: parseInt(totalArtistas.rows[0].count),
      totalAlbuns: parseInt(totalAlbuns.rows[0].count),
      generos: porGenero.rows,
      ultimasMusicas: ultimas.rows
    });
  } catch (erro) {
    console.error('Erro nas estatisticas:', erro);
    return res.status(500).json({ mensagem: 'Erro ao carregar estatisticas do painel.' });
  }
}

// Lista os generos disponiveis
async function listarGeneros(req, res) {
  try {
    const resultado = await conexao.query('SELECT * FROM generos ORDER BY genero ASC');
    return res.status(200).json(resultado.rows);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar generos.' });
  }
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  atualizar,
  excluir,
  estatisticas,
  listarGeneros
};
