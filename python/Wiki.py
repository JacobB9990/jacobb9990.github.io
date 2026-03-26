import requests
import time
from collections import deque
import json
import os

API_URL = "https://en.wikipedia.org/w/api.php"

HEADERS = {"User-Agent": "JacobNetworkScienceBot/1.0 (research project)"}


def get_all_links(title):
    links = []
    plcontinue = None

    while True:
        params = {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "links",
            "pllimit": "max",
        }

        if plcontinue:
            params["plcontinue"] = plcontinue

        r = requests.get(API_URL, params=params, headers=HEADERS)
        data = r.json()

        pages = data["query"]["pages"]
        page = next(iter(pages.values()))

        if "links" in page:
            links.extend([link["title"] for link in page["links"]])

        if "continue" in data:
            plcontinue = data["continue"]["plcontinue"]
            time.sleep(0.5)  # polite delay
        else:
            break

    return links


def save_to_json(nodes, edges, filename="graph.json"): 
    graph_data = { 
        "nodes": [{"id": n} for n in nodes], 
        "links": [ {"source": s, "target": t} for s, t in edges if s in nodes and t in nodes 
            ], 
        } 
    with open(filename, "w", encoding="utf-8") as f: 
        json.dump(graph_data, f, indent=2) 
        
    print(f"Saved {len(nodes)} nodes and {len(edges)} edges to {filename}")

def save_checkpoint(visited, edges, queue, filename="checkpoint.json"):
    data = {
        "visited": list(visited),
        "edges": edges,
        "queue": list(queue),
    }

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f)

    print(f"Checkpoint saved ({len(visited)} nodes).")


def load_checkpoint(filename="checkpoint.json"):
    if not os.path.exists(filename):
        return None

    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Loaded checkpoint ({len(data['visited'])} nodes).")

    return (
        set(data["visited"]),
        data["edges"],
        deque(data["queue"]),
    )


def crawl(start_title, max_nodes=800, checkpoint_file="checkpoint.json"):
    checkpoint = load_checkpoint(checkpoint_file)

    if checkpoint:
        visited, edges, queue = checkpoint
    else:
        visited = set()
        edges = []
        queue = deque([start_title])

    while queue and len(visited) < max_nodes:
        current = queue.popleft()

        if current in visited:
            continue

        print(f"Crawling: {current}")
        visited.add(current)

        try:
            links = get_all_links(current)
        except Exception as e:
            print("Error:", e)
            continue

        for link in links:
            if link not in visited:
                queue.append(link)
            edges.append((current, link))

        # Save every 50 nodes
        if len(visited) % 50 == 0:
            save_checkpoint(visited, edges, queue, checkpoint_file)

        time.sleep(0.5)

    # Final save
    save_checkpoint(visited, edges, queue, checkpoint_file)

    return visited, edges

nodes, edges = crawl("Mathematics", max_nodes=800)
save_to_json(nodes, edges, "data/graph.json")
