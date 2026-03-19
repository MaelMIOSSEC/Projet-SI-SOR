-- ============================================================
--  JEU DE DONNÉES DE TEST — Application Kanban (SI-SOR 2026)
--  Généré le 18/03/2026
-- ============================================================
--  Mots de passe en clair :
--    superadmin / admin  →  Admin@2026
--    autres              →  Password@123
--  Hash au format scrypt : {derivedKey hex}.{salt hex}
--  Compatible avec votre hashPassword() / verifyPassword()
-- ============================================================

USE `e22206673_db1`;

-- ============================================================
--  1. TABLE : User  (8 entrées)
-- ============================================================

INSERT INTO `User`
  (`user_id`, `username`, `name`, `last_name`, `password`, `email`, `is_admin`, `created_at`)
VALUES

-- Administrateur principal — MDP : Admin@2026
('aaaaaaaa-0000-0000-0000-000000000001',
 'superadmin', 'Alice', 'Dupont',
 '0718eecac9485f2969232f635f3d3f6113947ff8de7737ede7eac3b5ce164b1f81990a52354c8eaec2695060ecf5ea5dc3216dcbfe07c2abd6d80e519e6c6e6c.344e0bc8ee00af0027cbc870fa94547d',
 'alice.dupont@kanban.fr', TRUE, '2025-01-01'),

-- Compte "admin" (is_admin = FALSE) — MDP : Admin@2026
('aaaaaaaa-0000-0000-0000-000000000002',
 'admin', 'Bob', 'Martin',
 '53e4c8e3df6fd6280b28ce3a5075b6ee50de80191edc489a5d82b58a46807f4d1948ad51f4426d413af9139847c0460e958f60c01f1fe4c03d13be8048a8604d.5f461444b4cd249e28446d46121c74e6',
 'bob.martin@kanban.fr', FALSE, '2025-01-02'),

-- Utilisateurs standard — MDP : Password@123
('aaaaaaaa-0000-0000-0000-000000000003',
 'jdupont', 'Jean', 'Dupont',
 'ded21ca1aae4995b2443b8047f250c5630b208ecd62dfaa7a26ea2c817970a4a53bccdf16771b51968bbe05257e7413a48fd1f50df9aefcbea6be9a8507022e7.1edf8edd6acb2786f113de275d5e4a05',
 'jean.dupont@mail.fr', FALSE, '2025-02-10'),

('aaaaaaaa-0000-0000-0000-000000000004',
 'mmartin', 'Marie', 'Martin',
 '8205dd5cd865010cbcb840e76c6b08620dd3c19e31b58db62ec6a0428f86bb85c5a6fff40f0dbdad207fd52ff1f7cce55b5a9cfb90d5b75ac673800caf1b8d94.a18ff2cec0c329fb9679f869b30cc3b8',
 'marie.martin@mail.fr', FALSE, '2025-02-15'),

('aaaaaaaa-0000-0000-0000-000000000005',
 'lbernard', 'Lucas', 'Bernard',
 '6ed626b31c4fef194d1c6b9da1b536ac779c554d34b8d8702fabe0dfce7a1769172cfe0abe881dd9b497f0c0004a4e0d022705db691a30478b657e70c89d87b4.ea9303d527d60d461ef17282052445c5',
 'lucas.bernard@mail.fr', FALSE, '2025-03-01'),

('aaaaaaaa-0000-0000-0000-000000000006',
 'cmoreau', 'Clara', 'Moreau',
 'f0f1c7e9fe2a3ce4c51e1ef3d9a97780f9228755e1a030554a2e0f29444b85750d974489a537e39bc0dff8bf46d224aa324938ed6cb59870b428f9363d5da9e2.70594a45ccd3b2e413c2d29fccb6c6e6',
 'clara.moreau@mail.fr', FALSE, '2025-03-05'),

('aaaaaaaa-0000-0000-0000-000000000007',
 'pblanc', 'Pierre', 'Blanc',
 '2f2d01bef75ab303b9a877e9ecdacfe1ade15bd15580ece787a4634773f09752314b0f4ec2e9e103e3cc71eb8f111ba73d73022453499a0962b76130600d5e27.d9c46a0f3a3517f44d82ed4420bde1a8',
 'pierre.blanc@mail.fr', FALSE, '2025-03-10'),

('aaaaaaaa-0000-0000-0000-000000000008',
 'srobert', 'Sophie', 'Robert',
 '5b4b0ecf73d5f37b48bc07141b72a5b3aefef13f5ae5b0a55cb405b39170e099835454a393eb81f3e1c8475b348a552418ebf2c0e5f3aa580d8b2443fc9059cf.ce3b2f54d6c008337fd27832fb13661e',
 'sophie.robert@mail.fr', FALSE, '2025-04-01');


-- ============================================================
--  2. TABLE : Board  (7 entrées)
-- ============================================================

INSERT INTO `Board` (`board_id`, `title`)
VALUES
('bbbbbbbb-0000-0000-0000-000000000001', 'Projet Kanban App'),
('bbbbbbbb-0000-0000-0000-000000000002', 'Sprint Marketing Q2'),
('bbbbbbbb-0000-0000-0000-000000000003', 'Développement Backend'),
('bbbbbbbb-0000-0000-0000-000000000004', 'Design UI/UX'),
('bbbbbbbb-0000-0000-0000-000000000005', 'Tests & QA'),
('bbbbbbbb-0000-0000-0000-000000000006', 'Infrastructure DevOps'),
('bbbbbbbb-0000-0000-0000-000000000007', 'Onboarding Équipe');


-- ============================================================
--  3. TABLE : KanbanColumn  (11 entrées)
-- ============================================================

INSERT INTO `KanbanColumn` (`kanban_column_id`, `title`, `position`, `board_id`)
VALUES
('cccccccc-0000-0000-0000-000000000001', 'À faire',           1, 'bbbbbbbb-0000-0000-0000-000000000001'),
('cccccccc-0000-0000-0000-000000000002', 'En cours',          2, 'bbbbbbbb-0000-0000-0000-000000000001'),
('cccccccc-0000-0000-0000-000000000003', 'Terminé',           3, 'bbbbbbbb-0000-0000-0000-000000000001'),
('cccccccc-0000-0000-0000-000000000004', 'Backlog',           1, 'bbbbbbbb-0000-0000-0000-000000000002'),
('cccccccc-0000-0000-0000-000000000005', 'En production',     2, 'bbbbbbbb-0000-0000-0000-000000000002'),
('cccccccc-0000-0000-0000-000000000006', 'Publié',            3, 'bbbbbbbb-0000-0000-0000-000000000002'),
('cccccccc-0000-0000-0000-000000000007', 'À faire',           1, 'bbbbbbbb-0000-0000-0000-000000000003'),
('cccccccc-0000-0000-0000-000000000008', 'En développement',  2, 'bbbbbbbb-0000-0000-0000-000000000003'),
('cccccccc-0000-0000-0000-000000000009', 'En review',         3, 'bbbbbbbb-0000-0000-0000-000000000003'),
('cccccccc-0000-0000-0000-000000000010', 'Maquette',          1, 'bbbbbbbb-0000-0000-0000-000000000004'),
('cccccccc-0000-0000-0000-000000000011', 'Validé',            2, 'bbbbbbbb-0000-0000-0000-000000000004');


-- ============================================================
--  4. TABLE : Task  (10 entrées)
-- ============================================================

INSERT INTO `Task`
  (`task_id`, `title`, `description`, `deadline`, `priority`,
   `user_id`, `kanban_column_id`, `position`)
VALUES
('dddddddd-0000-0000-0000-000000000001',
 'Configurer l\'environnement de développement',
 'Installer Node, Deno, Java 21, MariaDB et MongoDB en local. Vérifier les connexions.',
 '2026-03-30', 'Strong',
 'aaaaaaaa-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000001', 1),

('dddddddd-0000-0000-0000-000000000002',
 'Implémenter les endpoints REST /tasks',
 'CRUD complet sur les tâches via Spring + JPA. Tester avec Postman.',
 '2026-04-15', 'Strong',
 'aaaaaaaa-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-000000000002', 1),

('dddddddd-0000-0000-0000-000000000003',
 'Rédiger la documentation technique',
 'Décrire toutes les API REST exposées par Tomcat. Format Markdown.',
 '2026-03-20', 'Low',
 'aaaaaaaa-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000003', 1),

('dddddddd-0000-0000-0000-000000000004',
 'Créer les visuels pour les réseaux sociaux',
 'Formats LinkedIn, Instagram et Twitter pour la campagne du trimestre.',
 '2026-04-01', 'Medium',
 'aaaaaaaa-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000004', 1),

('dddddddd-0000-0000-0000-000000000005',
 'Rédiger la newsletter mensuelle',
 'Synthèse des nouveautés produit et des actualités de l\'équipe.',
 '2026-03-25', 'Medium',
 'aaaaaaaa-0000-0000-0000-000000000006', 'cccccccc-0000-0000-0000-000000000005', 1),

('dddddddd-0000-0000-0000-000000000006',
 'Publier le bilan Q1 sur le blog',
 'Article de 800 mots avec graphiques des KPIs du premier trimestre.',
 '2026-03-18', 'Strong',
 'aaaaaaaa-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000006', 1),

('dddddddd-0000-0000-0000-000000000007',
 'Mettre en place le schéma SQL (MariaDB)',
 'Exécuter le script DDL, vérifier les contraintes FK et les index.',
 '2026-03-22', 'Strong',
 'aaaaaaaa-0000-0000-0000-000000000007', 'cccccccc-0000-0000-0000-000000000007', 1),

('dddddddd-0000-0000-0000-000000000008',
 'Endpoints User & Auth (Deno/Oak)',
 'Register, Login, JWT token generation, middleware de vérification.',
 '2026-03-28', 'Strong',
 'aaaaaaaa-0000-0000-0000-000000000008', 'cccccccc-0000-0000-0000-000000000008', 1),

('dddddddd-0000-0000-0000-000000000009',
 'Intégrer l\'authentification JWT côté Deno',
 'Vérification du token sur chaque requête protégée. Expiration 1h.',
 '2026-04-05', 'Strong',
 'aaaaaaaa-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000008', 2),

('dddddddd-0000-0000-0000-000000000010',
 'Code review des endpoints /boards et /columns',
 'Relecture, respect des conventions REST, gestion des erreurs 4xx/5xx.',
 '2026-04-10', 'Medium',
 'aaaaaaaa-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-000000000009', 1);


-- ============================================================
--  5. TABLE : BoardMember  (18 entrées)
-- ============================================================

INSERT INTO `BoardMember` (`user_id`, `board_id`, `role`)
VALUES
('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Owner'),
('aaaaaaaa-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000001', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000001', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000001', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 'Owner'),
('aaaaaaaa-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000002', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000002', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000002', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000003', 'Owner'),
('aaaaaaaa-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000003', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000003', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000004', 'Owner'),
('aaaaaaaa-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000004', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000004', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000005', 'Owner'),
('aaaaaaaa-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000005', 'Member'),
('aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000006', 'Owner'),
('aaaaaaaa-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000006', 'Member');

-- ============================================================
--  FIN DU SCRIPT
-- ============================================================
