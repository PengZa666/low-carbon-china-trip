# -*- coding: utf-8 -*-
"""Optimize city route for minimum total path length (TSP approximation).
Uses Euclidean distance in map coordinates. Starts from Beijing.
"""
import json
import math

CITIES_DATA = [
    ('beijing', 700, 333), ('shijiazhuang', 670, 376), ('taiyuan', 638, 381),
    ('hohhot', 625, 311), ('shenyang', 813, 288), ('changchun', 844, 239),
    ('harbin', 863, 194), ('shanghai', 782, 538), ('nanjing', 738, 517),
    ('hangzhou', 761, 560), ('fuzhou', 747, 659), ('jinan', 709, 409),
    ('zhengzhou', 655, 455), ('wuhan', 666, 553), ('changsha', 644, 608),
    ('guangzhou', 650, 729), ('nanning', 571, 736), ('haikou', 602, 802),
    ('chengdu', 501, 550), ('guiyang', 542, 646), ('kunming', 479, 684),
    ('lhasa', 292, 575), ('xian', 580, 466), ('lanzhou', 497, 423),
    ('xining', 464, 410), ('yinchuan', 537, 367), ('urumqi', 236, 240),
]

def dist(a, b):
    return math.sqrt((a[1]-b[1])**2 + (a[2]-b[2])**2)

def total_length(order, cities):
    coords = {c[0]: (c[1], c[2]) for c in cities}
    t = 0
    for i in range(len(order)):
        j = (i + 1) % len(order)
        a, b = order[i], order[j]
        t += dist((0, coords[a][0], coords[a][1]), (0, coords[b][0], coords[b][1]))
    return t

def nearest_neighbor(cities, start_id='beijing'):
    by_id = {c[0]: c for c in cities}
    order = [start_id]
    remaining = [k for k in by_id.keys() if k != start_id]
    while remaining:
        cx, cy = by_id[order[-1]][1], by_id[order[-1]][2]
        best = min(remaining, key=lambda r: (by_id[r][1]-cx)**2 + (by_id[r][2]-cy)**2)
        order.append(best)
        remaining.remove(best)
    return order

def two_opt(order, cities):
    coords = {c[0]: (c[1], c[2]) for c in cities}
    n = len(order)
    improved = True
    while improved:
        improved = False
        for i in range(n):
            for j in range(i+2, n + (0 if i > 0 else 0)):
                j = j % n
                if j <= i:
                    continue
                a, b, c, d = order[i], order[(i+1)%n], order[j], order[(j+1)%n]
                d1 = dist((0, coords[a][0], coords[a][1]), (0, coords[b][0], coords[b][1]))
                d2 = dist((0, coords[c][0], coords[c][1]), (0, coords[d][0], coords[d][1]))
                d3 = dist((0, coords[a][0], coords[a][1]), (0, coords[c][0], coords[c][1]))
                d4 = dist((0, coords[b][0], coords[b][1]), (0, coords[d][0], coords[d][1]))
                if d1 + d2 > d3 + d4:
                    order[i+1:j+1] = reversed(order[i+1:j+1])
                    improved = True
                    break
            if improved:
                break
    return order

def pixel_to_km(p):
    """Rough scale: China ~4000km / ~800px ≈ 5 km/pixel"""
    return round(p * 4.5)

def main():
    cities = CITIES_DATA
    order = nearest_neighbor(cities)
    order = two_opt(order, cities)
    
    # Re-run 2-opt a few times (sometimes helps)
    for _ in range(3):
        order = two_opt(order, cities)
    
    total_px = total_length(order, cities)
    print("Optimal order:", order)
    print("Total pixel distance:", round(total_px, 1))
    
    routes = []
    coords = {c[0]: (c[1], c[2]) for c in cities}
    for i in range(len(order)):
        a, b = order[i], order[(i+1) % len(order)]
        d = dist((0, coords[a][0], coords[a][1]), (0, coords[b][0], coords[b][1]))
        routes.append({'from': a, 'to': b, 'distance': pixel_to_km(d)})
    
    # Output JavaScript
    lines = ["  { from: '%s', to: '%s', distance: %d }" % (r['from'], r['to'], r['distance']) for r in routes]
    print("\n// ROUTES for data.js:\nconst ROUTES = [\n" + ",\n".join(lines) + "\n];")
    print("\nTotal displayed distance:", sum(r['distance'] for r in routes))
    
    with open('optimized_routes.json', 'w', encoding='utf-8') as f:
        json.dump(routes, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
