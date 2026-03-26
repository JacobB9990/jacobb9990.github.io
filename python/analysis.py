import networkx as nx
import json

with open("data/graph.json", "r", encoding="utf-8") as f:
    data = json.load(f)

G = nx.DiGraph()

for node in data["nodes"]:
    G.add_node(node["id"])

for link in data["links"]:
    G.add_edge(link["source"], link["target"])

print(nx.average_shortest_path_length(G))
