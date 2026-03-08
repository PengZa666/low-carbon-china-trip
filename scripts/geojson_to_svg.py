# -*- coding: utf-8 -*-
"""Convert China GeoJSON to SVG paths for viewBox 0 0 1000 850
Outputs: province_paths.js (省界) + china_outline.js (中国轮廓)
统一使用 DataV GeoAtlas 坐标系，确保轮廓与省界对齐"""
import json
import urllib.request
import os

# Project lon/lat to SVG coords (mainland China roughly 73-135 lon, 18-54 lat)
def project(lon, lat):
    x = (lon - 73) / 62 * 1000
    y = (54 - lat) / 36 * 850
    return x, y

def ring_to_path(ring, simplify=3):
    """Simplify: take every Nth point to reduce path size"""
    if not ring or len(ring) < 2:
        return ""
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

def geom_to_paths(geom, simplify=3):
    if not geom:
        return []
    coords = geom.get("coordinates", [])
    paths = []
    if geom.get("type") == "Polygon":
        if coords:
            paths.append(ring_to_path(coords[0], simplify))
    elif geom.get("type") == "MultiPolygon":
        for poly in coords:
            if poly and poly[0]:
                paths.append(ring_to_path(poly[0], simplify))
    return paths

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(script_dir) if script_dir else "."
    os.chdir(root)

    # 1. 中国轮廓（100000.json 单独轮廓，与省界同源同投影）
    url_outline = "https://geo.datav.aliyun.com/areas_v3/bound/100000.json"
    print("Fetching China outline...")
    with urllib.request.urlopen(url_outline) as r:
        outline_data = json.loads(r.read().decode("utf-8"))
    if "features" in outline_data and outline_data["features"]:
        geom = outline_data["features"][0].get("geometry", {})
    else:
        geom = outline_data.get("geometry", {})
    outline_paths = geom_to_paths(geom, simplify=2)  # 轮廓用更密取样
    outline_combined = " ".join(outline_paths) if outline_paths else ""
    print(f"China outline: {len(outline_paths)} path(s)")

    # 2. 省份边界（100000_full.json）
    url_full = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
    print("Fetching province bounds...")
    with urllib.request.urlopen(url_full) as r:
        data = json.loads(r.read().decode("utf-8"))
    features = data.get("features", [])
    def is_province(f):
        code = f.get("properties", {}).get("adcode")
        if code is None:
            return False
        try:
            c = int(str(code).split("_")[0])
            return c != 100000 and c % 10000 == 0
        except (ValueError, TypeError):
            return False
    province_features = [f for f in features if is_province(f)]
    if not province_features:
        province_features = features
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

    # Output province_paths.js
    out_prov = "// 中国各省份轮廓（虚线省界）, viewBox 0 0 1000 850\n"
    out_prov += "// 数据来源: DataV.GeoAtlas 100000_full\nconst CHINA_PROVINCE_PATHS = [\n"
    for item in all_paths:
        safe_name = item["name"].replace("'", "\\'")
        out_prov += f"  {{ name: '{safe_name}', adcode: {item['adcode']}, path: '{item['path']}' }},\n"
    out_prov += "];"
    with open("province_paths.js", "w", encoding="utf-8") as f:
        f.write(out_prov)
    print("Written province_paths.js")

    # Output china_outline.js
    out_outline = "// 中国轮廓 - DataV.GeoAtlas 100000（与省界同坐标系）\n"
    out_outline += "const CHINA_OUTLINE_PATH = '" + outline_combined.replace("'", "\\'") + "';\n"
    with open("china_outline.js", "w", encoding="utf-8") as f:
        f.write(out_outline)
    print("Written china_outline.js")

if __name__ == "__main__":
    main()
