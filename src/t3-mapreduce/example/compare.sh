#!/bin/bash

hadoop jar $HADOOP_PREFIX/contrib/streaming/hadoop-streaming-1.0.3.jar -mapper mapper2.py -reducer reducer.py -file mapper2.py -file reducer.py -input input -output output-mapper2.2

hadoop jar $HADOOP_PREFIX/contrib/streaming/hadoop-streaming-1.0.3.jar -mapper mapper.py -reducer reducer.py -file mapper.py -file reducer.py -input input -output output-mapper.2


