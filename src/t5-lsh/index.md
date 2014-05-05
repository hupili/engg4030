---
template: tutorial.html
title: Locality Sensitive Hash
---

# Locality Sensitive Hash

IPython has developed into the standard scientific computation environment of Python community. 
In this tutorial, we will walk you through basic setup and some common packages including
`numpy`, `scipy`, `matplotlib`.
You will be able to use it as a powerful caculator and all-in-one envrionemnt of data processing/ visualization.

## IPython

### Preparation

```
sudo apt-get update
sudo apt-get install ipython
sudo apt-get install ipython-notebook
```

### IPython

```
ipython
```

It's similar to default `python` shell.
Play around by yourself.

### IPython Notebook

Start notebook like this:

```
ipython notebook --no-browser --pylab=inline
```

Do a port mapping `-L8888:localhost:8888` so that you can visit it at:
http://localhost:8888/

### (suggested) More updated IPython

The above dist package only gives you IPython of 0.12.1.
We can install the most recent one, 1.2.0 (as of this writing).

```
sudo apt-get purge ipython ipython-notebook # Remove previous install from dist package
sudo apt-get install build-essential # Compiler tool chain to build binaries
sudo apt-get install python-dev # Provide header files like `Python.h`
sudo apt-get install python-pip # pip is the package manager for Python
sudo pip install pip --upgrade
sudo apt-get install python-numpy python-scipy python-matplotlib python-sympy
sudo pip install ipython # Install IPython
sudo pip install ipython --upgrade # Install IPython
sudo pip install jinja2
```

**TIP**:
There are some peculiar problems when installing
`numpy`, `scipy`, and `matplotlib` with `pip` in our environment.
So I use `apt-get` to install the pre-complied dist packages.

<!--
sudo easy_install -U distribute
LC_ALL=C sudo pip install jinja2 numpy scipy matplotlib # modules that we will use.
sudo apt-get install libfreetype6-dev
**TIP**:
`LC_ALL=C` is to solve the [problem here](http://stackoverflow.com/questions/17931726/ascii-codec-cant-decode-error-when-use-pip-to-install-uwsgi).
Usually you don't need it to install python packages.
-->

## Demo IPython Notebooks

   * Introduction:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial5/Introduction.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial5/Introduction.ipynb)
   * Locality-Sensitive-Hash.ipynb:
   [online viwer](http://nbviewer.ipython.org/urls/course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial5/Locality-Sensitive-Hash.ipynb),
   [source](https://course.ie.cuhk.edu.hk/~engg4030/tutorial/tutorial5/Locality-Sensitive-Hash.ipynb)

## References

   * Scipy lecture notes: http://scipy-lectures.github.io/

## Outcome of This Tutorial

   * Experience Python scientific computation in IPython Notebook.
   * Be able to mirror your previous MATLAB experience in Python.
   * Strengthen your understanding of the core of LSH: amplify a probability gap.
   Get familiar with important tools by the way.
