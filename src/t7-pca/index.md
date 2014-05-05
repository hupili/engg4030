---
template: tutorial.html
title: Principal Component Analysis
---

# Principal Component Analysis

See the IPython Notebooks:

   * Linear Algebra in IPython Notebook:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial7/Linear-Algebra.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial7/Linear-Algebra.ipynb)
   * Dimensionality Reduction:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial7/Dimensionality-Reduction.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial7/Dimensionality-Reduction.ipynb)

## Data Preparation (optional)

**NOTE**:
We already downloaded and preprocessed the data set.
URLs are already included in the above IPython notebook.
This section is only for those who are interested in the whole process.

LegcoHK releases voting records as open data starting from Sept 2013.
We use the [english version](http://www.legco.gov.hk/general/english/counmtg/yr12-16/mtg_1213.htm).

Here is a one-liner to get the list of XMLs from Chrome console.

```
$('.vote a').filter(function(){return $(this).attr('href').substr(-3,3)=='xml';}).map(function(){console.log($(this).attr('href'))})
```

We save it as: `list-of-xml.txt`

Batch download those files using the following commands:

```
mkdir legco-xml
cd legco-xml
cat ../list-of-xml.txt | xargs -P 10 -I{} wget http://www.legco.gov.hk/{}
```

We need to pre-process the XML files into a single CSV for further mining:

   * Legco-Preprocessing:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial7/Legco-Preprocessing.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial7/Legco-Preprocessing.ipynb)

You can use the same method to deal with [2013-2014 records](http://www.legco.gov.hk/general/english/counmtg/yr12-16/mtg_1314.htm).
We have collected all records from **20121017** to **20140219**.

## Outcome of This Tutorial

   * Have a feel of how a practical problem is tackled.
   We emphasize the mining part in this course but it's worth to know the whole story.
      * web scraping, 
      * data conversion, 
      * data cleaning, 
      * data transformation, 
      * data mining, 
      * visualization, 
      * ...
   * Be able to manipulate and decompose matrix in Python.
   Matrix decomposition is the fundamental routine of many advanced spectral embedding techniques.
   * Have a clear idea of how to use the decomposed sub-matrices in PCA.
   * Know there are some common pitfalls.
