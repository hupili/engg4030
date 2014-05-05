---
template: tutorial.html
title: Single Node Hadoop Setup
---

# Single Node Hadoop Setup

Hadoop rolled out version 2 last year.
Since version 1 is still the mainstream,
we show how to setup hadoop-1.2.1 in this tutorial,
which is the latest version 1 release.

## System

We work on the virtual machine created in last tutorial.
It runs Ubuntu 12.04 LTS distribution.
The following materials should apply to many other Linux distributions.
Just the specific commands may differ a bit.

## Environment and Dependencies

### Java

Hadoop requires Java Runtime Environment.
We install openjdk-6 for this tutorial.
See [the wiki](http://wiki.apache.org/hadoop/HadoopJavaVersions)
for a list of compatible Java versions.

```bash
sudo apt-get update
sudo apt-get install openjdk-6-jdk
```

Verify if you have successfully installed Java6.

```bash
azureuser@test-hpl:~$ java -version
java version "1.6.0_31"
OpenJDK Runtime Environment (IcedTea6 1.13.3) (6b31-1.13.3-1ubuntu1~0.12.04.2)
OpenJDK 64-Bit Server VM (build 23.25-b01, mixed mode)
```

### Hosts

Note, in order for Hadoop nodes to contact each other,
they need to resolve their own names.
The freshly launched VM on Azure (as of this writing) can not resolve its own name.
You can modify `/etc/hosts` such that it looks like the following:

```bash
azureuser@test-hpl:/opt/hadoop$ cat /etc/hosts
127.0.0.1 localhost

# The following lines are desirable for IPv6 capable hosts
::1 ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts

127.0.0.1 test-hpl
```

Note, change `test-hpl` to your own hostname,
which appears at the beginning of command line prompt `azureuser@test-hpl`.

### Password-less SSH

First generate your key pairs:

```bash
azureuser@test-hpl:~$ cd .ssh
azureuser@test-hpl:~/.ssh$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/azureuser/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/azureuser/.ssh/id_rsa.
Your public key has been saved in /home/azureuser/.ssh/id_rsa.pub.
The key fingerprint is:
b2:5c:35:2f:04:7a:47:81:b1:23:5e:40:55:67:df:6e azureuser@test-hpl
The key's randomart image is:
+--[ RSA 2048]----+
|     .o.+++.o    |
|       o.+ o . . |
|      o = =   . .|
|     . + = o   . |
|      o S . .   E|
|     . +   .   . |
|      o          |
|                 |
|                 |
+-----------------+
```

Put the pubkey in the authorized key list:

```bash
azureuser@test-hpl:~/.ssh$ cat id_rsa.pub >> authorized_keys
```

Check the setup:

```bash
azureuser@test-hpl:~/.ssh$ ssh localhost
The authenticity of host 'localhost (127.0.0.1)' can't be established.
ECDSA key fingerprint is 04:35:ad:f4:a1:cf:0d:c4:5e:c9:e4:65:6f:52:36:68.
Are you sure you want to continue connecting (yes/no)? yes
```

You will find that you re-loggged-in the same machine.
A new shell is allocated.
Remember to `exit` after the test.
The first time to SSH to a machine,
it will prompt you whether to accept the public key of the server.
After you typing `yes`,
the information will be recorded in `~/.ssh/known_hosts`.

**EXERCISE**:
You can skip this section first and see what happens when you start the cluster.
Then you'll find the password-less SSH setup saves you some typing.
This is especially useful when you manage a big cluster.

**EXERCISE**:
Explore the `~/.ssh/` folder.


## Download and Install Hadoop Package

We install Hadoop under `/opt/`.
First create the directories and give our user the ownership:

```bash
azureuser@test-hpl:~$ sudo mkdir -p /opt
azureuser@test-hpl:~$ sudo chown azureuser:azureuser /opt
azureuser@test-hpl:~$ cd /opt/
```

Verify we are in `/opt/` and have the read/write permissions.

```bash
azureuser@test-hpl:/opt$ pwd
/opt
azureuser@test-hpl:/opt$ ls -al .
total 8
drwxr-xr-x  2 azureuser azureuser 4096 Apr 28 07:05 .
drwxr-xr-x 23 root      root      4096 May  2 03:18 ..
```

Download Hadoop package from
[official repository](http://archive.apache.org/dist/hadoop/core/):

```bash
azureuser@test-hpl:/opt$ wget 'http://archive.apache.org/dist/hadoop/core/hadoop-1.2.1/hadoop-1.2.1.tar.gz'
```

A good habit is to verify the downloaded package before installing it.
We first use `curl` to download the correct message digests for `hadoop-1.2.1.tar.gz`.
We cam then use `md5sum` and `sha1sum` to check the downloaded file.

```bash
azureuser@test-hpl:/opt$ curl http://archive.apache.org/dist/hadoop/core/hadoop-1.2.1/hadoop-1.2.1.tar.gz.mds
hadoop-1.2.1.tar.gz:    MD5 = 8D 79 04 80 56 17 C1 6C  B2 27 D1 CC BF E9 38 5A
hadoop-1.2.1.tar.gz:   SHA1 = B07B 88CA 658D C9D3 38AA  84F5 C68C 809E B7C7 0964
hadoop-1.2.1.tar.gz: RMD160 = 6330 DED6 043A 1C8D D859  7910 E77F 3DED F249 A807
hadoop-1.2.1.tar.gz: SHA224 = 3500FE1F 513A32D7 AD3EEBA1 F177710C 3D678534
                              CD6DA4F4 13C8188E
hadoop-1.2.1.tar.gz: SHA256 = 94A11817 71F173BD B55C8F90 17228258 66396091
                              F0516BDD 12B34DC3 DE1706A1
hadoop-1.2.1.tar.gz: SHA384 = 2ABAF8DB 781FB3EA 11621937 1847445C 44B5C7D7
                              48EC8410 43D96C9A 9D6DD978 F300CE18 F02D9FC8
                              ED6B8176 D08E5B62
hadoop-1.2.1.tar.gz: SHA512 = 79C6423D 1E0E2835 98442DCF FD63DA52 BF3AB53B
                              80957243 7BAF8DA8 38B592E1 E776430E A67DB53E
                              52B78112 5BCAB225 DC222632 63CDF185 7D2A7A46
                              A4966DA8
azureuser@test-hpl:/opt$ md5sum hadoop-1.2.1.tar.gz
8d7904805617c16cb227d1ccbfe9385a  hadoop-1.2.1.tar.gz
azureuser@test-hpl:/opt$ sha1sum hadoop-1.2.1.tar.gz
b07b88ca658dc9d338aa84f5c68c809eb7c70964  hadoop-1.2.1.tar.gz
```

Uncompress the downloaded `.tar.gz` archive.
Instead of operating on directory `hadoop-1.2.1`,
it is better to soft link it to `hadoop`.
In this way,
you don't have to modify other programs
when you upgrade your Hadoop version.

```bash
azureuser@test-hpl:/opt$ tar -xzvf hadoop-1.2.1.tar.gz
...
azureuser@test-hpl:/opt$ ln -s hadoop-1.2.1 hadoop
azureuser@test-hpl:/opt$ ls
hadoop  hadoop-1.2.1  hadoop-1.2.1.tar.gz
```

## Configuration

### Environment Variables

Export the environment variables in your `~/.bashrc`.
You can use `vim` to edit the file
or use `cat >> ~/.bashrc` followed by an input stream.
Check your configuration:

```bash
azureuser@test-hpl:/opt/hadoop/conf$ tail ~/.bashrc
# sources /etc/bash.bashrc).
if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
    . /etc/bash_completion
fi

export HADOOP_PREFIX=/opt/hadoop
export HADOOP_HOME=$HADOOP_PREFIX
export JAVA_HOME=/usr/lib/jvm/java-6-openjdk-amd64
export PATH=$PATH:$HADOOP_HOME/bin

```

You can activate those environment variables by `source ~/.bashrc`.
This configuration will also be loaded every time you login.

Now issue the `hadoop` command.
You should be able to see the following prompt.

```bash
azureuser@test-hpl:/opt/hadoop/conf$ hadoop
Warning: $HADOOP_HOME is deprecated.

Usage: hadoop [--config confdir] COMMAND
where COMMAND is one of:
  namenode -format     format the DFS filesystem
  secondarynamenode    run the DFS secondary namenode
  namenode             run the DFS namenode
  datanode             run a DFS datanode
...
```

**TIP**:
You may see a warning "Warning: $HADOOP_HOME is deprecated.".
The reason is that `HADOOP_HOME` is deprecated.
You can use `HADOOP_PREFIX` as the new recommended environment variable.
(<i class="fa fa-thumbs-up fa-fw"></i> Robin Lee)

**TIP**:
You may see a warning that deprecates `localhost:9000` for `fs.default.name`.
Use `hdfs://localhost:9000` to solve it.
(<i class="fa fa-thumbs-up fa-fw"></i> Gao Ruohan)

### Hadoop Configurations

Hadoop configuration files are in `/opt/hadoop/conf`:

```bash
azureuser@test-hpl:/opt/hadoop/conf$ ls
capacity-scheduler.xml  hadoop-metrics2.properties  mapred-site.xml         taskcontroller.cfg
configuration.xsl       hadoop-policy.xml           masters                 task-log4j.properties
core-site.xml           hdfs-site.xml               slaves
fair-scheduler.xml      log4j.properties            ssl-client.xml.example
hadoop-env.sh           mapred-queue-acls.xml       ssl-server.xml.example
```

Modify the configuration as follows.
The output is [Git Diff](http://git-scm.com/docs/git-diff) format.
A line starting with `-` means we removed it.
A line starting with `+` means we added it.
Before the content diff is presented, there will be two lines showing the file name,
e.g. `core-site.xml`.

```diff
index 970c8fe..317d9ba 100644
--- a/core-site.xml
+++ b/core-site.xml
@@ -5,4 +5,13 @@
 
 <configuration>
 
+  <property>
+    <name>hadoop.tmp.dir</name>
+    <value>/opt/hadoop-tmp</value>
+    <description>A base for other temporary directories.</description>
+  </property>
+  <property>
+     <name>fs.default.name</name>
+     <value>hdfs://localhost:9000</value>
+  </property>
 </configuration>
diff --git a/hadoop-env.sh b/hadoop-env.sh
index 01654b9..97ccb79 100644
--- a/hadoop-env.sh
+++ b/hadoop-env.sh
@@ -6,7 +6,7 @@
 # remote nodes.
 
 # The java implementation to use.  Required.
-# export JAVA_HOME=/usr/lib/j2sdk1.5-sun
+export JAVA_HOME=/usr/lib/jvm/java-6-openjdk-amd64
 
 # Extra Java CLASSPATH elements.  Optional.
 # export HADOOP_CLASSPATH=
diff --git a/hdfs-site.xml b/hdfs-site.xml
index 970c8fe..4e52fa4 100644
--- a/hdfs-site.xml
+++ b/hdfs-site.xml
@@ -5,4 +5,8 @@
 
 <configuration>
 
+     <property>
+         <name>dfs.replication</name>
+         <value>1</value>
+     </property>
 </configuration>
diff --git a/mapred-site.xml b/mapred-site.xml
index 970c8fe..5d8b379 100644
--- a/mapred-site.xml
+++ b/mapred-site.xml
@@ -5,4 +5,9 @@
 
 <configuration>
 
+     <property>
+         <name>mapred.job.tracker</name>
+         <value>localhost:9001</value>
+     </property>
 </configuration>
+
```


**TIP**:
Use ctrl+d to end the input when you use the `cat >` approach to create file.

**TIP**:
A crash course of VIM:
start VIM by `vim file-to-edit`;
use `i` to enter the insert mode;
move cursor by arrow keys;
do your edits;
type `<ESC>` to end insert mode;
type `:wq` to save and quit the editor.
You are suggested to learn more about VIM after the tutorial.


## Test HDFS

Before you start the cluster for the first time,
you need to prepare some data structure for HDFS's namenode.
This is done via following `-format` command.
You can also check `/opt/hadoop-tmp/` to see some directories and files are created.

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop namenode -format
...
azureuser@test-hpl:/opt/hadoop$ ls /opt/hadoop-tmp/
dfs
```

Once ready, you can start HDFS using `start-dfs.sh` script.
This by default launches a single node cluster.
Check whether `NameNode`, `SecondaryNameNode` and `DataNode` are running.

```bash
azureuser@test-hpl:/opt/hadoop$ start-dfs.sh
...
azureuser@test-hpl:/opt/hadoop$ jps
12549 NameNode
12939 SecondaryNameNode
12741 DataNode
13012 Jps
```

If you know the `ps` command for Linux,
`jps` is an analogy of `ps` for Java processes.
Although you can use system's `ps` to check Java process,
e.g. `ps aux | grep java,
The output is too long to comprehend.

If the cluster is running,
you can operate HDFS using command `hadoop dfs XXXX`.
Type `hadoop dfs` to see a list of commands.
The names are very like other linux commands, e.g. `-ls`, `-mv`, ...

Test create/delete a dir under the root:

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -mkdir /testdir
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /
Found 1 items
drwxr-xr-x   - azureuser supergroup          0 2014-05-02 04:42 /testdir
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -rmr /testdir
Deleted hdfs://localhost:9000/testdir
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /
```

Upload a test file:

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -copyFromLocal README.txt /README.txt
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -tail /README.txt
try, of
encryption software.  BEFORE using any encryption software, please
check your country's laws, regulations and policies concerning the
import, possession, or use, and re-export of encryption software, to
see if this is permitted.  See <http://www.wassenaar.org/> for more
information.
...
```

**EXERCISE**:
Checkout `-copyToLocal` to download a file.

You can use `stop-dfs.sh` to stop the HDFS cluster.
Let’s keep running for now because the Hadoop MapReduce runs on HDFS.

**NOTE**:
You need to work step by step.
If some components are not running, e.g. `DataNode`,
you can try to check the logs usually located at `$HADOOP_PREFIX/logs`.

## Test Example MapReduce Job

Start the Hadoop MapReduce and check running processes by `jps`.
There are two more processes: `JobTracker` and `TaskTracker`.

```bash
azureuser@test-hpl:/opt/hadoop$ start-mapred.sh
starting jobtracker, logging to /opt/hadoop-1.2.1/libexec/../logs/hadoop-azureuser-jobtracker-test-hpl.out
localhost: starting tasktracker, logging to /opt/hadoop-1.2.1/libexec/../logs/hadoop-azureuser-tasktracker-test-hpl.out
azureuser@test-hpl:/opt/hadoop$ jps
12549 NameNode
12939 SecondaryNameNode
13834 Jps
12741 DataNode
13600 JobTracker
13785 TaskTracker
```

The there is an example suite in hadoop-1.2.1 package.
Find the list of examples as follows:


```bash
azureuser@test-hpl:/opt/hadoop$ hadoop jar hadoop-examples-1.2.1.jar
An example program must be given as the first argument.
Valid program names are:
  aggregatewordcount: An Aggregate based map/reduce program that counts the words in the input files.
  aggregatewordhist: An Aggregate based map/reduce program that computes the histogram of the words in the input files.
  dbcount: An example job that count the pageview counts from a database.
  grep: A map/reduce program that counts the matches of a regex in the input.
  join: A job that effects a join over sorted, equally partitioned datasets
  multifilewc: A job that counts words from several files.
  pentomino: A map/reduce tile laying program to find solutions to pentomino problems.
  pi: A map/reduce program that estimates Pi using monte-carlo method.
  randomtextwriter: A map/reduce program that writes 10GB of random textual data per node.
  randomwriter: A map/reduce program that writes 10GB of random data per node.
  secondarysort: An example defining a secondary sort to the reduce.
  sleep: A job that sleeps at each map and reduce task.
  sort: A map/reduce program that sorts the data written by the random writer.
  sudoku: A sudoku solver.
  teragen: Generate data for the terasort
  terasort: Run the terasort
  teravalidate: Checking results of terasort
  wordcount: A map/reduce program that counts the words in the input files.
```

We try the wordcount example.
We need to know how to pass parameters:

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop jar hadoop-examples-1.2.1.jar  wordcount
Usage: wordcount <in> <out>
```

Then we do a wordcount using the `README.txt` we uploaded to HDFS in last section.

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop jar hadoop-examples-1.2.1.jar  wordcount /README.txt /output/
14/05/02 05:25:11 INFO input.FileInputFormat: Total input paths to process : 1
14/05/02 05:25:11 INFO util.NativeCodeLoader: Loaded the native-hadoop library
14/05/02 05:25:11 WARN snappy.LoadSnappy: Snappy native library not loaded
14/05/02 05:25:12 INFO mapred.JobClient: Running job: job_201405020524_0001
14/05/02 05:25:13 INFO mapred.JobClient:  map 0% reduce 0%
14/05/02 05:25:21 INFO mapred.JobClient:  map 100% reduce 0%
14/05/02 05:25:30 INFO mapred.JobClient:  map 100% reduce 33%
14/05/02 05:25:31 INFO mapred.JobClient:  map 100% reduce 100%
14/05/02 05:25:33 INFO mapred.JobClient: Job complete: job_201405020524_0001
...
```

Check the output after the job is finished:

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /
Found 3 items
-rw-r--r--   1 azureuser supergroup       1366 2014-05-02 04:54 /README.txt
drwxr-xr-x   - azureuser supergroup          0 2014-05-02 05:24 /opt
drwxr-xr-x   - azureuser supergroup          0 2014-05-02 05:25 /output
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -ls /output/
Found 3 items
-rw-r--r--   1 azureuser supergroup          0 2014-05-02 05:25 /output/_SUCCESS
drwxr-xr-x   - azureuser supergroup          0 2014-05-02 05:25 /output/_logs
-rw-r--r--   1 azureuser supergroup       1306 2014-05-02 05:25 /output/part-r-00000
azureuser@test-hpl:/opt/hadoop$ hadoop dfs -tail /output/part-r-00000
ty	1
License	1
Number	1
Regulations,	1
SSL	1
Section	1
Security	1
See	1
Software	2
```

## More

### Start/Stop the Cluster

You can use `start-all.sh` and `stop-all.sh`
to start and stop the entire cluster,
including HDFS and MapReduce.

### Check Job History

```bash
azureuser@test-hpl:/opt/hadoop$ hadoop job -history /output/

Hadoop job: 0001_1399008311838_azureuser
=====================================
Job tracker host name: job
job tracker start time: Thu May 20 01:50:20 UTC 1976
```

## References

   * Hadoop streaming:
   <http://hadoop.apache.org/docs/stable1/streaming.html>
   * Generic command options:
   <http://hadoop.apache.org/docs/stable1/streaming.html#Generic+Command+Options>
   * Streaming commmand options:
   <http://hadoop.apache.org/docs/stable1/streaming.html#Streaming+Command+Options>


## Outcome of This Tutorial

   * Have a basic idea of Hadoop package.
   * Have a basic idea of the workflow of running a Hadoop MapReduce job.
