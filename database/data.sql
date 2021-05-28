insert into "hosts" ("hostId", "name", "poolId")
            values (1, 'katie', 1),
                   (2, 'kiki', 2),
                   (3, 'bailey', 3),
                   (4, 'lola', 4),
                   (5, 'jessi', 5);

insert into "pools" ("poolId", "location", "price", "description", "rules", "amenities", "image", "hostId")
            values  (1, 'Manteca', 35, 'beautiful pool with hottub to relax in', 'no diving, no smoking, no running', 'lounge chairs, table, umbrellas', '/images/image-1622154689139.jpeg', 1),
                    (2, 'Manteca', 40, 'nice pool', 'no smoking', 'table', '/images/image-1622154689139.jpeg', 2),
                    (3, 'Sonora', 50, 'pool with hottub', 'no diving', 'lounge chairs, bathroom available upon request', '/images/image-1622154689139.jpeg', 3),
                    (4, 'Modesto', 25, 'big pool', 'no running', 'chairs', '/images/image-1622154689139.jpeg', 4),
                    (5, 'Manteca', 38, 'pool', 'no diving', 'chairs', '/images/image-1622154689139.jpeg', 5);
