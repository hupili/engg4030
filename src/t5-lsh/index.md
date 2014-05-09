---
template: tutorial.html
title: Locality Sensitive Hash
---

# Locality Sensitive Hash

IPython has evolved into the standard scientific computation environment of Python community. 
In this tutorial, we will walk you through basic setup and some common packages including
`numpy`, `scipy`, `matplotlib`.
You will be able to use it as a powerful calculator and all-in-one environment of data processing/ visualization.

## Install IPython

Follow the steps listed below.

```bash
azureuser@test-hpl:~$ sudo apt-get upddate
...
azureuser@test-hpl:~$ sudo apt-get install build-essential
...
azureuser@test-hpl:~$ sudo apt-get install python-dev
...
azureuser@test-hpl:~$ sudo apt-get install python-pip
...
azureuser@test-hpl:~$ pip install --user ipython
...
azureuser@test-hpl:~$ pip install --user pyzmq jinja2 tornado
```

Add one line `export PATH=$PATH:$HOME/.local/bin/` at the end of your `~/.bashrc`.
This will include python package executables installed via `pip install --user`.
Remember to `source ~/.bashrc` after the modification.

Now you can run IPython Notebook:

```bash
azureuser@test-hpl:~$ ipython notebook --no-browser
2014-05-09 05:49:55.867 [NotebookApp] Using existing profile dir: u’/home/azureuser/.ipython/profile_default’
2014-05-09 05:49:55.873 [NotebookApp] Using MathJax from CDN: http://cdn.mathjax.org/mathjax/latest/MathJax.js
2014-05-09 05:49:55.898 [NotebookApp] Serving notebooks from local directory: /home/azureuser
2014-05-09 05:49:55.898 [NotebookApp] 0 active kernels 
2014-05-09 05:49:55.898 [NotebookApp] The IPython Notebook is running at: http://127.0.0.1:8888/
2014-05-09 05:49:55.898 [NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
```

The web UI is listening on <http://localhost:8888/> (on the remote machine).
If you have forwarded port 8888, you can open the web UI in browser.

**TIP**:
You can do this in terminal `ssh azureuser@your-domain -L8888:localhost:8888`.
Or, see Tutorial 3 for how to do SSH port forwarding on other platforms.

Let’s also install some commonly used Python packages.

```bash
sudo apt-get install python-numpy python-scipy python-matplotlib
...
azureuser@test-hpl:~$ sudo pip install --upgrade pip
...
azureuser@test-hpl:~$ sudo pip install --upgrade distribute
...
azureuser@test-hpl:~$ pip install --upgrade --user pandas
...
azureuser@test-hpl:~$ pip install --upgrade --user scikit-learn
...
```

## IPython Notebooks

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
