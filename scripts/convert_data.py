#!/usr/bin/env python3
"""一次性脚本：把 src/data.js 中的 XML 字符串解析为 {THEME, CARD, COMB} JSON。

复用 getData.js 的解析逻辑：遍历 <theme>/<card>/<comb> 节点，取全部属性，
按 id 建索引。运行：python scripts/convert_data.py
产物：src/data/gameData.json
"""
import json
import re
import os
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'data.js')
OUT = os.path.join(ROOT, 'src', 'data', 'gameData.json')


def extract_xml_string(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # let cardInfoXML = `...`
    m = re.search(r'cardInfoXML\s*=\s*`(.*)`', content, re.DOTALL)
    if not m:
        raise RuntimeError('未找到 cardInfoXML 模板字符串')
    return m.group(1)


def parse_nodes(xml: str, tag: str):
    res = {}
    # 用正则提取每个 <tag ...></tag> 或 <tag .../> 的属性
    pattern = re.compile(r'<' + tag + r'(\s[^>]*?)(?:/\s*>|>\s*</' + tag + r'>)', re.DOTALL)
    attr_pattern = re.compile(r'(\w+)="([^"]*)"')
    for m in pattern.finditer(xml):
        attrs_str = m.group(1)
        attrs = dict(attr_pattern.findall(attrs_str))
        if 'id' not in attrs:
            continue
        res[attrs['id']] = attrs
    return res


def main():
    xml = extract_xml_string(SRC)
    theme = parse_nodes(xml, 'theme')
    card = parse_nodes(xml, 'card')
    comb = parse_nodes(xml, 'comb')
    data = {'THEME': theme, 'CARD': card, 'COMB': comb}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    size_mb = os.path.getsize(OUT) / 1024 / 1024
    print(f'OK: theme={len(theme)} card={len(card)} comb={len(comb)} -> {OUT} ({size_mb:.2f} MB)')


if __name__ == '__main__':
    main()
