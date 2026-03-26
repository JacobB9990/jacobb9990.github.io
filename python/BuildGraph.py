import json
import networkx as nx
import networkx.algorithms.community as nx_comm

with open("data/graph.json", "r", encoding="utf-8") as f:
    data = json.load(f)

G = nx.DiGraph()

for node in data["nodes"]:
    G.add_node(node["id"])

for link in data["links"]:
    G.add_edge(link["source"], link["target"])

print("Original Nodes:", G.number_of_nodes())
print("Original Edges:", G.number_of_edges())


def is_valid(title):
    blacklist_prefixes = (
        "Wikipedia:",
        "Portal:",
        "Help:",
        "Template:",
        "Category:",
        "File:",
        "Special:",
    )

    blacklist_contains = ("List of", "Archive", "Index of")

    if title.startswith(blacklist_prefixes):
        return False

    if any(x in title for x in blacklist_contains):
        return False

    return True


clean_nodes = [n for n in G.nodes if is_valid(n)]
G = G.subgraph(clean_nodes).copy()

print("After cleaning junk:")
print("Nodes:", G.number_of_nodes())
print("Edges:", G.number_of_edges())


largest_cc = max(nx.weakly_connected_components(G), key=len)
G = G.subgraph(largest_cc).copy()

print("After largest component:")
print("Nodes:", G.number_of_nodes())
print("Edges:", G.number_of_edges())


degree_threshold = 100

low_degree_nodes = [n for n in G.nodes if G.degree(n) <= degree_threshold]
G.remove_nodes_from(low_degree_nodes)

print("After removing low-degree:")
print("Nodes:", G.number_of_nodes())
print("Edges:", G.number_of_edges())


pagerank = nx.pagerank(G)

top_n = 800
top_nodes = sorted(pagerank, key=pagerank.get, reverse=True)[:top_n]

G = G.subgraph(top_nodes).copy()

print("After PageRank filter:")
print("Nodes:", G.number_of_nodes())
print("Edges:", G.number_of_edges())


clean_data = {
    "nodes": [{"id": n} for n in G.nodes()],
    "links": [{"source": u, "target": v} for u, v in G.edges()],
}

with open("data/graph_low_100.json", "w", encoding="utf-8") as f:
    json.dump(clean_data, f, ensure_ascii=False, indent=2)

print("Saved cleaned graph to data/graph_clean.json")
