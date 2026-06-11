import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { slugify } from '../src/posts/utils/slugify';

const prisma = new PrismaClient();

const USERS = [
  { name: 'Júlio Lima', email: 'julio@codeconnect.dev' },
  { name: 'Ada Lovelace', email: 'ada@codeconnect.dev' },
  { name: 'Alan Turing', email: 'alan@codeconnect.dev' },
];

const POSTS = [
  {
    title: 'Hooks no React: useState e useEffect na prática',
    description:
      'Entenda como gerenciar estado e efeitos colaterais em componentes funcionais com exemplos comentados.',
    content:
      'React Hooks mudaram a forma como escrevemos componentes. Neste post vamos explorar useState para gerenciar estado local e useEffect para lidar com efeitos colaterais como chamadas de API, assinaturas e timers. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['React', 'Front-end'],
    coverUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    title: 'Acessibilidade web: o básico que todo dev precisa saber',
    description:
      'Boas práticas de ARIA, contraste de cores e navegação por teclado para tornar sua aplicação acessível.',
    content:
      'Acessibilidade não é um extra, é parte do produto. Vamos cobrir landmarks ARIA, foco visível, contraste mínimo de 4.5:1 e testes com leitores de tela. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['Acessibilidade', 'Front-end'],
    coverUrl: null,
  },
  {
    title: 'Construindo APIs REST com NestJS e Prisma',
    description:
      'Um guia passo a passo para estruturar módulos, controllers e services em uma API NestJS com Prisma ORM.',
    content:
      'NestJS traz uma arquitetura modular inspirada no Angular, ideal para APIs robustas. Combinado com Prisma, ganhamos type-safety de ponta a ponta. Vamos ver módulos, DTOs com class-validator e migrations. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['Node.js', 'Backend'],
    coverUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  {
    title: 'Tailwind CSS v4: o que mudou no novo mecanismo de tema',
    description:
      'Conheça o novo bloco @theme, geração automática de utilities e como migrar tokens de cor.',
    content:
      'A versão 4 do Tailwind introduz uma engine baseada em CSS nativo, com @theme para declarar tokens de design que viram utilities automaticamente. Vamos comparar com a v3 e mostrar uma migração de tokens de cor. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['CSS', 'Front-end'],
    coverUrl: null,
  },
  {
    title: 'TypeScript avançado: tipos condicionais e mapped types',
    description:
      'Domine tipos condicionais, infer e mapped types para criar APIs de tipos mais expressivas.',
    content:
      'Tipos condicionais (T extends U ? X : Y) e mapped types permitem criar transformações de tipos poderosas. Vamos construir utilitários como DeepPartial e PickByType do zero. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['TypeScript'],
    coverUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  },
  {
    title: 'Testando componentes React com Testing Library',
    description:
      'Escreva testes que simulam o comportamento real do usuário usando React Testing Library e Vitest.',
    content:
      'A filosofia da Testing Library é testar o software da forma como ele é usado. Vamos cobrir queries acessíveis, user-event e mocks de chamadas assíncronas. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['React', 'Testes'],
    coverUrl: null,
  },
  {
    title: 'Modelando bancos de dados Postgres com Prisma',
    description:
      'Relacionamentos 1:N, N:N, índices e arrays nativos do Postgres no schema.prisma.',
    content:
      'O Prisma Schema Language oferece uma forma declarativa de modelar bancos relacionais. Vamos explorar relações, índices compostos, arrays nativos do Postgres e migrations geradas automaticamente. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['Backend', 'Postgres'],
    coverUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
  },
  {
    title: 'Autenticação JWT com NestJS passo a passo',
    description:
      'Implemente registro, login e rotas protegidas usando Passport, JWT e bcrypt.',
    content:
      'Vamos construir um fluxo completo de autenticação: hash de senha com bcrypt, emissão de tokens JWT e proteção de rotas com guards do Passport. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['Node.js', 'Segurança'],
    coverUrl: null,
  },
  {
    title: 'Design Atômico na prática com componentes React',
    description:
      'Organize seu projeto em atoms, molecules, organisms, templates e pages para escalar com consistência.',
    content:
      'Atomic Design ajuda a manter consistência visual e reuso de componentes. Vamos ver como estruturar pastas, nomear componentes e escrever testes para cada camada. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['React', 'Design System'],
    coverUrl:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
  },
  {
    title: 'Full-text search no Postgres sem dependências externas',
    description:
      'Use tsvector, tsquery e índices GIN para implementar busca relevante direto no banco.',
    content:
      'O Postgres já vem com um motor de busca textual poderoso. Vamos criar uma coluna tsvector gerada, um índice GIN e consultas com websearch_to_tsquery para busca em linguagem natural. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
    tags: ['Postgres', 'Backend'],
    coverUrl: null,
  },
];

const COMMENTS = [
  'Excelente explicação, me ajudou muito!',
  'Muito bom, mas ficou faltando um exemplo com TypeScript.',
  'Salvei para ler com calma depois, parece ótimo.',
  'Já apliquei isso no meu projeto e funcionou perfeitamente.',
];

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany({
    where: { email: { in: USERS.map((u) => u.email) } },
  });

  const passwordHash = await bcrypt.hash('senha123', 10);

  const users = await Promise.all(
    USERS.map((user) =>
      prisma.user.create({
        data: { ...user, passwordHash },
      }),
    ),
  );

  const posts = await Promise.all(
    POSTS.map((post, index) =>
      prisma.post.create({
        data: {
          ...post,
          slug: slugify(post.title),
          authorId: users[index % users.length].id,
        },
      }),
    ),
  );

  for (const [index, post] of posts.entries()) {
    const likers = users.filter((_, i) => i !== index % users.length);
    await prisma.like.createMany({
      data: likers
        .slice(0, (index % likers.length) + 1)
        .map((user) => ({ postId: post.id, userId: user.id })),
    });

    const commentCount = index % COMMENTS.length;
    for (let i = 0; i < commentCount; i += 1) {
      await prisma.comment.create({
        data: {
          text: COMMENTS[i],
          postId: post.id,
          authorId: users[(index + i + 1) % users.length].id,
        },
      });
    }
  }

  console.log(`Seed concluído: ${users.length} usuários, ${posts.length} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
