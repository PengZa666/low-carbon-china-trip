# -*- coding: utf-8 -*-
"""Convert China province GeoJSON to SVG paths for viewBox 0 0 1000 850"""
import json
import urllib.request

# Project lon/lat to SVG coords (mainland China roughly 73-135 lon, 18-54 lat)
def project(lon, lat):
    x = (lon - 73) / 62 * 1000
    y = (54 - lat) / 36 * 850
    return x, y

def ring_to_path(ring, simplify=3):
    """Simplify: take every Nth point to reduce path size"""
    if not ring or len(ring) < 2:
        return ""
    # 取样点，保证首尾相连
    idx = list(range(0, len(ring), simplify))
    if idx[-1] != len(ring) - 1:
        idx.append(len(ring) - 1)
    sampled = [ring[i] for i in idx]
    x0, y0 = project(sampled[0][0], sampled[0][1])
    path = f"M {x0:.1f} {y0:.1f}"
    for pt in sampled[1:]:
        x, y = project(pt[0], pt[1])
        path += f" L {x:.1f} {y:.1f}"
    path += " Z"
    return path

def geom_to_paths(geom):
    if not geom:
        return []
    coords = geom.get("coordinates", [])
    paths = []
    if geom.get("type") == "Polygon":
        if coords:
            paths.append(ring_to_path(coords[0]))
    elif geom.get("type") == "MultiPolygon":
        for poly in coords:
            if poly and poly[0]:
                paths.append(ring_to_path(poly[0]))
    return paths

def main():
    url = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
    print("Fetching GeoJSON...")
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read().decode("utf-8"))
    
    features = data.get("features", [])
    # 仅保留省级（adcode 末4位为0000，如 110000 北京）
    def is_province(f):
        code = f.get("properties", {}).get("adcode")
        if code is None:
            return False
        try:
            c = int(str(code).split("_")[0])
            return c != 100000 and c % 10000 == 0  # 排除全国，只要省份
        except (ValueError, TypeError):
            return False
    province_features = [f for f in features if is_province(f)]
    if not province_features:
        province_features = features  # fallback
    all_paths = []
    for f in province_features:
        props = f.get("properties", {})
        name = props.get("name", "")
        adcode = props.get("adcode", "")
        geom = f.get("geometry", {})
        paths = geom_to_paths(geom)
        for p in paths:
            if p:
                all_paths.append({"name": name, "adcode": adcode, "path": p})
    
    print(f"Converted {len(all_paths)} province polygons")
    # Output as JS
    out = "// 中国各省份轮廓（虚线省界）, viewBox 0 0 1000 850\n"
    out += "// 数据来源: DataV.GeoAtlas 100000_full\nconst CHINA_PROVINCE_PATHS = [\n"
    for i, item in enumerate(all_paths):
        safe_name = item["name"].replace("'", "\\'")
        out += f"  {{ name: '{safe_name}', adcode: {item['adcode']}, path: '{item['path']}' }},\n"
    out += "];"
    
    with open("province_paths.js", "w", encoding="utf-8") as f:
        f.write(out)
    print("Written province_paths.js")

if __name__ == "__main__":
    main()
