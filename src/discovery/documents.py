"""Document model and a small cross-industry sample corpus loader."""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Document:
    id: str
    text: str
    metadata: dict = field(default_factory=dict)


_TOKEN_RE = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    """Lowercase alphanumeric tokenizer shared by the lexical and embedding paths."""
    return _TOKEN_RE.findall(text.lower())


def load_corpus(directory: str) -> list[Document]:
    """Loads markdown/text files from a directory into Documents (one doc per file)."""
    docs: list[Document] = []
    for name in sorted(os.listdir(directory)):
        path = os.path.join(directory, name)
        if not os.path.isfile(path):
            continue
        with open(path, encoding="utf-8") as handle:
            text = handle.read()
        docs.append(Document(id=name, text=text, metadata={"source": name}))
    return docs
