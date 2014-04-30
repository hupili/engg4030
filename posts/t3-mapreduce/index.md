---
template: tutorial.html
title: Tutorial 3
---

# Python 101 and MapReduce 101 using Hadoop Streaming

After this tutorial, student can script in Python and know where to find documentation/ support.
Student will also write their first MapReduce program in Python using *Hadoop streaming*.

**NOTE**:
We are using **hadoop-1.0.3** in this tutorial. 
We assume your environment follows the setup in [Tutorial 2](../tutorial2). 
If not, change path, options, and names where necessary.

## Python 101

You should have Python 2.7 installed by default. 
If not, try `sudo apt-get install python`.

### Basic interactive environment and notation

This is a [REPL](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop). 

```pycon
azureuser@test-hpl:/opt$ python
Python 2.7.3 (default, Sep 26 2013, 20:03:06) 
[GCC 4.6.3] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> print 'hello world'
hello world
>>> quit()
azureuser@test-hpl:/opt$ 
```

Explained:

   * `$`: the prompt of bash.
   * `>>>`: the prompt of Python.
   * `print 'hello world'`: one Python expression.
   * `hello world`: the outout of last expression.

Following subsections should be straightforward.
Just type and watch.
You'll figure out what they mean.

**EXERCISE**:
Exercise the official Python tutorial: 
http://docs.python.org/2/tutorial/index.html

### Simple arithmetics

```pycon
>>> 1+5
6
>>> 3 * 4
12
>>> 3 / 2
1
>>> 3 // 2
1
>>> 3.0 / 2
1.5
>>> 3.0 // 2
1.0
>>> 3 % 2
1
>>> 3.0 % 2
1.0
```

[More](http://docs.python.org/2/tutorial/introduction.html#numbers)

### String manipulation

```pycon
>>> 'a' + "b"
'ab'
>>> 'a' * 5
'aaaaa'
>>> ' aaaa '
' aaaa '
>>> ' aaaa '.strip()
'aaaa'
>>> 'a b c d'.split()
['a', 'b', 'c', 'd']
>>> '%d,%.2f,%s' % (1, 1.12345, 'hello')
'1,1.12,hello'
```

[More](http://docs.python.org/2/tutorial/introduction.html#strings)

### List 

```pycon
>>> range(1,5)
[1, 2, 3, 4]
>>> [1] + [2, 3, 4]
[1, 2, 3, 4]
>>> l = [1, 2, 'a', 'b']
>>> l
[1, 2, 'a', 'b']
>>> len(l)
4
>>> l[0]
1
>>> l[-1]
'b'
>>> l[0:3]
[1, 2, 'a']
>>> l[:3]
[1, 2, 'a']
>>> l[1:]
[2, 'a', 'b']
```

[More](http://docs.python.org/2/tutorial/introduction.html#lists)

### Dictionary

```pycon
>>> d = {'k1': 'v1'}
>>> d
{'k1': 'v1'}
>>> d['k2'] = 'v2'
>>> d
{'k2': 'v2', 'k1': 'v1'}
>>> d.update({'k1': 1, 'k3': 3})
>>> d
{'k3': 3, 'k2': 'v2', 'k1': 1}
```

[More](http://docs.python.org/2/tutorial/datastructures.html#dictionaries)

### Set

```pycon
>>> a = set([1,2,3])
>>> b = set([2,3,4])
>>> a
set([1, 2, 3])
>>> b
set([2, 3, 4])
>>> a & b
set([2, 3])
>>> a - b
set([1])
>>> b - a
set([4])
>>> a | b
set([1, 2, 3, 4])
```

[More](http://docs.python.org/2/tutorial/datastructures.html#sets)

### Functions

```pycon
>>> sum([1,2,3])
6
>>> ord('A')
65
>>> chr(66)
'B'
>>> int('1')
1
>>> str(1)
'1'
```

[More](http://docs.python.org/2/library/functions.html)

### Control flow

Create `control.py`:

```python
for i in range(0, 5):
    if i < 3:
        print i, "is smaller than 3"
    elif i == 3:
        print i, "is 3"
    else:
        print i, "is greater than 3"
```

Execute:

```
$python control.py 
0 is smaller than 3
1 is smaller than 3
2 is smaller than 3
3 is 3
4 is greater than 3
```

[More](http://docs.python.org/2/tutorial/controlflow.html)

### The schema of learning Python

Find help:

```pycon
>>> help(sum)

Help on built-in function sum in module __builtin__:

sum(...)
    sum(sequence[, start]) -> value
    
    Returns the sum of a sequence of numbers (NOT strings) plus the value
    of parameter 'start' (which defaults to 0).  When the sequence is
    empty, returns start.
```

Everything in Python is object.
You can not only call `help` on functions, but also anything else:

```pycon
>>> help('string')
...
    split(s, sep=None, maxsplit=-1)
        split(s [,sep [,maxsplit]]) -> list of strings
        
        Return a list of the words in the string s, using sep as the
        delimiter string.  If maxsplit is given, splits at no more than
        maxsplit places (resulting in at most maxsplit+1 words).  If sep
        is not specified or is None, any whitespace string is a separator.
...
```

Or, official doc: http://docs.python.org/2/

Or, Google, Stackoverflow, ...

Learn by write; learn by modify; learn by read.

## iPython, bPython and IDEs (optional)

The default `python` interpreter only provides a basic interactive shell.
To make your work more efficient, you can try:

```
sudo apt-get install ipython
sudo apt-get install bpython
```

My use case:

   * `ipython` is well integrated with scientific computation features.
   `ipython notebook` is especially useful, which will be covered later.
   * `bpython` provides awesome completion. 
   It is a day saver for console hackers.

Except for general IDEs, you may consider those tailored for Python:

   * [IDLE](http://docs.python.org/2/library/idle.html)
   * [PyCharm](http://www.jetbrains.com/pycharm/)

## Environment Preparation

### Export path variables upon login

Put the following in the end of `~/.bashrc`:

```bash
export HADOOP_PREFIX=/opt/hadoop
export JAVA_HOME=/usr/lib/jvm/java-6-openjdk-amd64
export PATH=$PATH:$HADOOP_PREFIX/bin
export HADOOP_CONF_DIR=$HADOOP_PREFIX/conf
```

After this, you don't have to type the full path of `hadoop` executable anymore.

After you finish editing `.bashrc` file, use one of the following ways to apply the changes:

   * `source ~/.bashrc`
   * exit the SSH session and re-login.

### Port mapping

Login your machine as follows:

```
ssh azureuser@test-hpl.cloudapp.net -L50030:localhost:50030
```

`-L50030:localhost:50030` tells SSH to do a port from your server to your local desktop.
`50030` is the default job traker port we will see later.

If you are using Putty, try to find the configuration options for port mapping, as follows:

![](putty-port-mapping.png)

Check whether port mapping works by visiting:
[http://localhost:50030/](http://localhost:50030/).
If your single-node Hadoop is running, you should be able to see job information from the web UI.

## MapReduce for Word Counting

### Hadoop streaming 

   * Mapper and Reducer are just normal Linux executables.
   * Mapper: 
   takes input stream from [standard input](http://en.wikipedia.org/wiki/Standard_streams);
   emmit key-value pairs to [standard output](http://en.wikipedia.org/wiki/Standard_streams).
   Each key-value pair takes one line and is formatted as `'%s\t%s' % (key, value)`.
   * Shuffler:
   Takes key-value pairs emitted from mapper and sort by keys.
   * Reducer:
   takes input key-value pairs from STDIN; output key-value pairs to STDOUT.
   * If there is no tab ('\t'), the whole line is treated as a key.
   See Hadoop streaming doc for "Customizing the Way to Split Lines into Key/Value Pairs".

### Basic counting

Check whether you have the Shakespeare data:

```
azureuser@test-hpl:~$ hadoop dfs -ls /user/azureuser/input
Found 1 items
-rw-r--r--   3 azureuser supergroup    6460232 2014-01-21 11:59 /user/azureuser/input/bigfile
```

We use the combined `bigfile`, because it works faster under our current settings.

Write your `mapper.py`:

```python
#!/usr/bin/env python

import sys

for line in sys.stdin:
    for word in line.split():
        print '%s\t%s' % (word, 1)
```

Write your `reducer.py`:

```python
#!/usr/bin/env python

import sys

cur_key = None
cur_count = 0

for line in sys.stdin:
    key, value = line.split()
    if key == cur_key:
        cur_count += int(value)
    else:
        if cur_key:
            print '%s\t%s' % (cur_key, cur_count)
        cur_key = key
        cur_count = int(value)

print '%s\t%s' % (cur_key, cur_count)
```

Submit job:

```
$hadoop jar $HADOOP_PREFIX/contrib/streaming/hadoop-streaming-1.0.3.jar -mapper mapper.py -reducer reducer.py -file mapper.py -file reducer.py -input input -output output
```

The parameters `-mapper`, `-reducer`, `-input`, `-output` are straightforward as their names.
The `-file` parameter specifies those local files to upload.
The convention:

   * `-input`/`-output`: absolute or relative path on HDFS; data.
   * `-file`: one for each file related with this job; the executables, configurations, dictionaries, ...

### The most frequent words?

Although we don't have to bother Hadoop on this simple question,
we use Hadoop this time for demonstration purpose.

Our output from last job:

```
$hadoop dfs -cat /user/azureuser/output/part-00000 | head -n 5
"A  1
"B  1
"C  1
"D  1
"E  1
```

Since Hadoop has built-in sorting function, we just let it sort second column for us.
How to sort second column?
We'll see later how to do it in a simpler way.
Now let's assume we know nothing more than the previous Hadoop streaming command.
Try to leverage the feature of Hadoop.

Make `swap.py`:

```python
#!/usr/bin/env python

import sys

for line in sys.stdin:
    word, count = line.split()
    print '%07d\t%s' % (int(count), word)
```

Launch Hadoop job:

```
$hadoop jar $HADOOP_PREFIX/contrib/streaming/hadoop-streaming-1.0.3.jar -mapper swap.py -file swap.py -input output -output output-count-sorted
```

Explained:

   * Hadoop sort according to key, so we only need to put the counts in first "column".
   * By default, shuffling stage performs a string sorting, not integer sorting.
   We played a trick, `%07d`, to pad leading zeros, 
   so that string sorting and integer sorting are equivalent in this case.

Check the output:

```
$hadoop dfs -cat /user/azureuser/output-count-sorted/part-00000 | tail -n 5
0019155 of
0019248 and
0020085 I
0025512 the
0030984 *
```

**NOTE**:
This can cause a lot traffic in practice if you have a really large data set.
Don't `-cat` and `tail` in real works (**and homeworks**).
If you want to find most frequent words, 
just add a reducer to the above example and only keep the top results
(instead of a full list of sorted items).

### Sort reduce output (optional)

We noted above that there is an easier way to sort by count.

```
$hadoop jar $HADOOP_PREFIX/contrib/streaming/hadoop-streaming-1.0.3.jar -D stream.num.map.output.key.fields=2 -D mapred.output.key.comparator.class=org.apache.hadoop.mapred.lib.KeyFieldBasedComparator -D mapred.text.key.comparator.options=-k2,2nr -mapper cat -reducer cat -input output -output output-count-sorted4
```

Check result:

```
$hadoop dfs -cat /user/azureuser/output-count-sorted4/part-00000 | head -n 5
* 30984 
the 25512 
I 20085 
and 19248 
of  19155 
```

   * Originally, we output `word<tab>count` in reduce.
   By default, only `word` is regarded as the key.
   `-D stream.num.map.output.key.fields=2` option tells Hadoop to take two fields as key, i.e. `word<tab>count`.
   * `-D mapred.output.key.comparator.class`.
   This option makes Hadoop compare keys before storing them into HDFS.
   * `-D mapred.text.key.comparator.options=-k2,2nr`.
   This specifies comparation rules.
   The parameters are similar to Linux `sort` command.
   `-k2,2nr` is equivalent to `cat <reduce-output> | sort -k2,2 -n -r`.

**NOTE**:
You don't have to run word count and sort as two jobs.
Note that we used dummy mapper and reducer (i.e. `cat`) in this section.
You can simply add the Hadoop MapReduce options to our first word counting example.

### Monitor jobs

Find the job tracker: [http://localhost:50030/](http://localhost:50030/)

Navigate around the figure out the meaning yourself.
It's useful to:

   * monitor the progress of jobs
   * get breakdown execution time (mapper, reducer)

You can find the same information in `$HADOOP_PREFIX/logs/userlogs`.

### A simple optimization

Instead of emitting `word<tab>1` pairs,
we can aggregate them in mapper first.

The modified `mapper2.py`:

```python
#!/usr/bin/env python

import sys
from collections import defaultdict

cache = defaultdict(int)
for line in sys.stdin:
    for word in line.split():
        cache[word] += 1

for (word, count) in cache.iteritems():
    print '%s\t%s' % (word, count)
```

Run:

```
$hadoop jar $HADOOP_PREFIX/contrib/streaming/hadoop-streaming-1.0.3.jar -mapper mapper2.py -reducer reducer.py -file mapper2.py -file reducer.py -input input -output output2
```

The improvement is not so significant.
On my machine, it reduces from 42s to 38s.
This is because our input data is too small.

**EXERCISE**:
Upload another 3 copies of the `bigfile` you created in last tutorial.
Compare the performance of `mapper.py` and `mapper2.py`
(example difference 1min v.s. 48s).
How about running it on the original ~200 small files?

General take-away:

   * Script level optimization to make mapper and reducer run faster.
   Python has many built-in data structure and functions for data processing.
   Usually you don't have to write your own.
   When you write one, it usually performs worse than those insanely optimized built-in's.
   * Communication cost dominates CPU and memory in many cases.
   Try to shuffle as few data as possible.

## Outcome

   * Can use Python to solve simple problems.
   * Understand the mechanism of Hadoop streaming.
   * Can program MapReduce tasks in Hadoop streaming model.
   * Have a basic idea of optimizations under MapReduce framework.

## Reference

   * Official Python tutorial: http://docs.python.org/2/tutorial/
   * Python idom by David Goodger: http://python.net/~goodger/projects/pycon/2007/idiomatic/presentation.html
   * Python learning resources from Berkeley: http://python.berkeley.edu/learning_resources.html
   * Python4Science starter kit by Fernando Pérez (IPython initiator): http://fperez.org/py4science/starter_kit.html
   * Hadoop Streaming: http://hadoop.apache.org/docs/stable1/streaming.html
   * [Python introductory resources](https://github.com/ga-students/DS_HK_1/wiki/Guides-00-:-Prework)

-----

Download the archive of codes used in this tutorial:
[example.tar.gz](example.tar.gz).
