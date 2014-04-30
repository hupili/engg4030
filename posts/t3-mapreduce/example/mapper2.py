#!/usr/bin/env python

import sys
from collections import defaultdict

cache = defaultdict(int)
for line in sys.stdin:
    for word in line.split():
        cache[word] += 1

for (word, count) in cache.iteritems():
    print '%s\t%s' % (word, count)
