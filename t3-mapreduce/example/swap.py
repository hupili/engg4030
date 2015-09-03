#!/usr/bin/env python

import sys

for line in sys.stdin:
    word, count = line.split()
    print '%07d\t%s' % (int(count), word)