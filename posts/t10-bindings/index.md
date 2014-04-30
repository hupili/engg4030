---
layout: tutorial
title: Tutorial 11
---

# Python bindings of Hadoop and GraphLab

## Summary of current works

The materials of this course focus on hands-on training.
Let's summarize what we have done in tutorials and homeworks so far:

   * Tutorial 1, 2, 3, 4:
      * Systems, targeting "big data"
      * Linux, Hadoop, Python, Shell
   * Tutorial 5, 6, 7, 9, 10:
      * Algorithms, working with "small data".
      * LSH, K-means, PCA, RecSys, Graph
      * Synthetic data (Tut5, Tut6);
      Real data (Tut7, Tut9, Tut10);
      Data collection/pre-processing (Tut7).
      * Primitive way of implementation (Tut5, Tut6, Tut7);
      Packages (Tut9, Tut10).
      * Python scientific computing environment.
   * HW1, HW2:
      * Hadoop and MapReduce programming model
      * Linux, Hadoop, Python, Shell
   * HW3:
      * Mahout, a machine learning package on Hadoop.
      * Linux, Mahout
   * HW4:
      * GraphLab (via existing C++ packages)
      * Linux, GraphLab, Mahout

In the system part, you touched almost all underlying details.
This is essential training but does not make your work more efficient.
In the algorithm part, we work in a unified scientific computing environment.
It is convenient but we only played with small data.
Many distributed computation platforms have (official/ 3rd-party) Python bindings.
They are the bridge to get the best out of both ends.
That's the goal of this tutorial

## Hadoop bindings in Python

   * Hadoop in IPython Notebook:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial11/Python-Hadoop.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial11/Python-Hadoop.ipynb)

## GraphLab bindings in Python

   * GraphLab in IPython Notebook:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial11/Python-Graph-Lab.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial11/Python-Graph-Lab.ipynb)


## Outcome

   * Master shell integration in IPython Notebook,
   which enables programmably invokation of many Linux tools.
   * Have an idea of language-specific "bindings".
   Many open source projects may not be written in your language of choice.
   However, there may be such bindings.
   * Hands-on one Hadoop binding (`mrjob`)
   and GraphLab binding (`GraphLab Create`).
