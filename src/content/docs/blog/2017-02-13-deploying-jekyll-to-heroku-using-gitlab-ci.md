---
title: "Deploying Jekyll to Heroku using GitLab CI"
date: 2017-02-13 19:16 -0400
tags:
  - Tutorials
excerpt: >
  It took a day, but I managed to learn how to deploy a Jekyll blog to
  Heroku using GitLab CI, even though I'd never used GitLab CI before.
  This not only provides a tutorial, but also an example of applying a
  Learning Tests approach to something other than code running in a single
  process.
---
<aside markdown="1">

Following is not only a tutorial, but also an example of the notes that I take when I figure out how to do something. In here you'll find _Learning Tests_ --- at least the fully-documented, incremental learning spirit of them --- in enough detail to recreate the learning artifacts months (years, even) from now, if you need to re-learn the steps from the beginning.

</aside>

<!-- more -->

I would like to use GitLab CI in order to be able to separate rebuilding a Jekyll site from deploying the static web pages to a production web server. I know that I _can_ deploy a Jekyll project to Heroku using a buildpack to build the static site remotely; however, that seems wasteful to me compared to merely deploying the resulting static site into production. Since I don't know how to use GitLab CI, I'd like to explore what it does. I most definitely _do not_ want to use my Jekyll project to learn the basics, since this adds moving parts that I don't thoroughly understand. Instead, I'd rather do something closer to writing learning tests, in order to limit the unknowns.

## README

I'm following the instructions at <https://docs.gitlab.com/ce/ci/quick_start/README.html>.

+   Add `.gitlab-ci.yml` to the root of the project. This file includes the instructions for GitLab to run. I assume that this works like a Git `post-receive` hook.
+   Configure a GitLab Runner, which seems to require Go (according to what I've read), which makes me nervous, because I don't want to adopt too many dependencies.

I want the GitLab CI configuration file to do the equivalent of saying "Hello, world", so that I can simply verify that it runs. I also want to use a dead-simple project with nothing special in it, so that I can poke around, run manual tests, without fear of injuring anything significant.

So, I did the following:

```bash
$ cd $WORKSPACES_ROOT # Where I put projects on my file system
$ git init learn-gitlab-ci
```

This creates a new project, initializing a Git repository inside it. Next, I go to <https://gitlab.com> to create a repository there for this project, so that I can push to it. In my case, I ended up with a remote repository at `git@gitlab.com:jbrains/learn-gitlab-ci.git`.

```bash
$ export PROJECT_ROOT="$WORKSPACES_ROOT/learn-gitlab-ci"
$ cd $PROJECT_ROOT
$ git remote add gitlab git@gitlab.com:jbrains/learn-gitlab-ci.git
$ git remote -v
gitlab  git@gitlab.com:jbrains/learn-gitlab-ci.git (fetch)
gitlab  git@gitlab.com:jbrains/learn-gitlab-ci.git (push)
```

Now I'm ready to add content to this project, so I start with the GitLab CI configuration file.

```bash
$ cd $PROJECT_ROOT
$ mvim .gitlab-ci.yml
```

```yaml
# The new content of .gitlab-ci.yml
before_script:
  - echo "This runs before the build jobs."

build_job_1:
  - echo "This is the first build job."

build_job_2:
  - echo "This is the second build job."
```

This gives me something to commit, push, and wonder where in the universe `echo` echoes text to.

```bash
$ cd $PROJECT_ROOT
$ git add -A
$ git commit -m "Trying to detect the basic GitLab CI job lifecycle."
$ git push gitlab master
```

After pushing these changes to GitLab, I go to the GitLab project at <https://gitlab.com> to find the _Pipelines_ page for the project. Conveniently, I find the _Pipelines_ page at <https://gitlab.com/jbrains/learn-gitlab-ci/pipelines>. Before I get there, I find out by email that my pipeline has failed.

On the pipelines page, I see a message showing that the pipeline has failed for the reason "yaml invalid". Weird, because the YAML syntax looked correct to me. Conveniently, at the _Pipelines_ page, I see a button labeled "CI Lint", which, if I press, should give me some useful feedback about the syntax of my GitLab CI configuration file… so I press it.

Curiously, when I press "CI Lint", I end up at a page which threatens to let me edit my GitLab CI configuration file, except that the editor has no content, which makes me wonder whether, somehow, I failed to put the file in the right place. Perhaps it has the wrong name? Perhaps something else weird has gone wrong? I don't get it.

_This is one of the many reasons that I decided not to try this with my Jekyll project. At least now, I don't feel tempted to become distracted by wondering if Jekyll somehow relates to the problem._

Strange. The file `$PROJECT_ROOT/.gitlab-ci.yml` appears in the _Files_ section of my GitLab repository. It has the content that I expect. That content looks like valid YAML. I have no idea how this could fail.

OK. Maybe I need to paste the GitLab CI configuration YAML into this text editor in order to check it. I try that. Sure enough, when I press "validate", I see the same error message: *jobs:build_job_1 config should be a hash*.

Aha! Looking more closely, I misread the sample GitLab CI configuration file. The build jobs need to be a hash, and I've made them a list. I try to fix the build job accordingly.

```yaml
# .gitlab-ci.yml
before_script:
  - echo "This runs before the build jobs."

build_job_1:
  script:
    - echo "This is the first build job."

build_job_2:
  script:
    - echo "This is the second build job."
```

To test this, I need to commit, then push.

```bash
$ cd $PROJECT_ROOT
$ git add -A
$ git commit -m "The GitLab CI configuration file now specific build job scripts correctly, as far as I can tell."
$ git push gitlab master
```

I browse to the GitLab project's _Pipelines_ page again and see success! Well… success _so far_. The two build jobs `build_job_1` and `build_job_2` are _running_, which surprises me a little, since I made them very, very short jobs.

No matter. While I'm waiting for the jobs to complete, I go back to the "CI Lint" page, paste the new contents of the GitLab CI configuration file, then validate the file. Looking at the output, I learn the following:

+   The syntax is correct.
+   I can expect the `before_script` to run before _each build job_, much like `@Before` in JUnit. I should therefore make sure that `before_script` does something idempotent.
+   I can specify `on_success` for each build job, which _I presume_ runs some commands when the build job succeeds. This gives me something to look up so that I learn more details about the contract with GitLab CI.

While I learned these things, my build jobs finished. They took over two minutes to run, they succeeded, and when I click on each job, I see both the source commands (the `echo` command) and the output (the echoed text itself). This makes me feel very good about exploring the build job and pipeline lifecycle in more detail.

I also notice in the output that GitLab CI is using `docker` with Ruby image 2.1. _Can I choose the Ruby version that GitLab CI uses to run our build jobs?_ I'll have to look that up. This also gives me hope that we don't need to install `docker` and `go` and all that nonsense, because GitLab does that for us. (That makes perfect sense.)

_As I read more, it seems that as long GitLab's default shared CI runners do what I need, then I can use them and not worry about installing runners myself. I'd like to see how far I can go with that._

## What Else Can I Do?

In order to learn more about the options in GitLab CI configuration, I look at examples at <https://docs.gitlab.com/ce/ci/examples/README.html>.

While poking around, I found that I can specify a Docker image which would have a specific Ruby version installed, so that I could run Jekyll in a controlled environment. I do not have the energy to create a Docker image right now, so I hope that I can just use something simpler. While poking around some more (at <https://gitlab.com/help/ci/yaml/README.md>), I find that I can specify a built-in image for Ruby 2.1. Maybe I can do the same for Ruby 2.3.3, since I'm using that version of Ruby locally.

### Try Running Build Jobs with Ruby 2.3.3

```bash
$ cd $PROJECT_ROOT
$ git checkout -b try-specifying-ruby-version
$ mvim .gitlab-ci.yml
```

I changed the GitLab CI configuration file in what amounts to a manual microtest. It specifies the Ruby 2.3.3 image and has a single job that merely echoes the Ruby version. I did this on a separate branch to make it easier to switch back to a GitLab CI configuration file that I expect to work.

```yaml
image: ruby:2.3.3

check_ruby_version:
  script:
    - ruby --version
```

Now, I commit and push to the remote repository, wondering whether GitLab CI launches a build on every branch, or merely on receiving something to `master`.

```bash
$ git add -A
$ git commit -m "We try to run a build job on Ruby 2.3.3."
$ git push --all gitlab
```

Now, I go back to the _Pipelines_ page on GitLab to see what happens, if anything. I see a running pipeline, so _GitLab CI runs when it receives a push to any branch, and not only `master`_.

Since I have to stop this working session and do something else, let me summarize where we are.

+   Adding a GitLab CI configuration file called `.gitlab-ci.yml` to the root of a Git repository activates GitLab CI on that project using the so-called "shared runners".
+   I've chosen to ignore the details of shared runners for now, since whatever magic they perform now suffices so far.
+   I can specify multiple, parallel—and therefore _independent_ and _isolated_—build jobs, each as a hash with an entry for the key `script` that maps to a sequence of bash (or bash-like) commands that perform the job.
+   I can specify a single `before_script` script that GitLab CI runs before each build job. This script should probably be idempotent and self-contained, because multiple copies of it might run independently.
+   I can specify a Docker image to simplify setting up the build job runtime environment, such as with a specific version of Ruby.
+   GitLab CI runs no matter which branch I push to, so `master` appears not to have any privileged meaning in this regard.

While talking to Sarah about this, we tried to trigger a GitLab CI build by editing a file directly at <https://gitlab.com>.

1.  Go to the project at <https://gitlab.com/jbrains/learn-gitlab-ci>.
2.  Go to a branch and choose a file. (I only have my GitLab CI configuration file, so I had more of a Hobson's Choice.)
3.  Edit the file. I changed the Ruby image to version 2.2.
4.  Commit the change to a new branch, only because I wanted to keep each manual microtest on a separate branch. This created a merge request, but I actually don't want to merge this into any existing branch, so I simply went back to the project page.
5.  Open the _Pipelines_ page and see a new build job running on the new branch. It installed a GitLab CI runner installing Ruby 2.2, and sure enough, it installed `ruby-2.2.6p396`. **Success!**

This means that _when we change a file at the GitLab web site, we create a new commit for the project and this triggers a build, just as though we had pushed that change from a different repository_. Good news: we can immediately build each time an individual file changes; bad news: we are forced to immediately build each time an individual file changes. Whether this helps or doesn't depends on one's preferences.

## Pushing To A Remote Repository

In order to _securely_ push to a remote `git` repository, I need a way to provide credentials to the remote repository in the little Docker container that GitLab CI uses to run my build jobs. Right off the top of my head, I can envision a few ways to make this work.

+   The remote repository provider gives me an authorization token that I can use to push to the remote repository.
+   I add an SSH key to the remote repository and bundle that key in the local repository.
+   I build a custom GitLab CI runner (a Docker container, as far as I can tell so far) that bundles the authorization rights (SSH key, token, whatever) to the remote repository.

I would _really_ like to avoid the Docker-based solution, because I don't know Docker well enough to make that work, and I don't particularly want to learn that today. I can live with, but would prefer not to use the authorization token solution, because then my pipeline depends on knowing details about the deployment destination, more than simply "a `git` repository at _this_ address". I don't know how to bundle an SSH key in my local repository, because I usually use the default location of SSH keys (`\$HOME/.ssh`). No matter what I choose, I'm not going to like it.

In this situation, unless someone gives me a more suitable idea, I'll opt for the solution that requires the least obtrusive work, at least for now. I know that I first want to push to a Heroku repository, so I can start by exploring how to push to a Heroku repository with a token instead of an SSH key.

### Pushing To A Heroku Repository Without An SSH Key

I'd like to try this without going through GitLab CI, since doing that slows down my feedback cycle. I think I can get this working first using my local environment, and then try to replicate it in a GitLab CI pipeline build job. Certainly, if I can't get it working locally, then I don't have a chance of getting it to work in GitLab CI.

I need to create a Heroku app, ask Heroku to generate some kind of authorization token that lets me push to that app, _don't_ set up an SSH key that lets me push to that app, then use the token to push to that app from a local `git` repository. My first test can consist of creating the Heroku app, and then verifying that I _can't_ push to it, even with the SSH key that is configured for my Heroku account. I don't know whether this is even possible. I would hate to _accidentally_ have authorization to push to this Heroku app, since I definitely wouldn't have that in my GitLab CI environment.

First, I visit <https://www.heroku.com>, log in, and then create a simple app that does nothing. I only care that I can or can't push to this repository using `git` from my local environment command line. I don't need the app to actually do anything on the web, and nobody will ever know that it exists.

```bash
$ cd $WORKSPACE_ROOT
$ git init learn-pushing-to-heroku-without-ssh-keys
$ cd learn-pushing-to-heroku-without-ssh-keys
# I'll call this folder CHECK_PUSH_PROJECT_ROOT
$ heroku apps:create try-pushing-without-ssh-keys
$ git remote -v
heroku  https://git.heroku.com/try-pushing-without-ssh-keys.git (fetch)
heroku  https://git.heroku.com/try-pushing-without-ssh-keys.git (push)
```

I notice that, by default, Heroku adds the remote repository using secure HTTP Git transport, rather than SSH Git transport. This leads me to <https://devcenter.heroku.com/articles/git> where I read (in the section <https://devcenter.heroku.com/articles/git#http-git-authentication>) that with HTTP Git authentication, I can't use SSH keys, but rather only Heroku API keys for authentication. Good! This already matches what I think I want. In order to check that I understand this, pushing to this remote should already fail.

```bash
$ cd CHECK_PUSH_PROJECT_ROOT
$ git commit --allow-empty -m "Test 1, pushing without SSH keys."
$ git push heroku master
Counting objects: 2, done.
Writing objects: 100% (2/2), 186 bytes | 0 bytes/s, done.
Total 2 (delta 0), reused 0 (delta 0)
remote: error: pathspec '.' did not match any file(s) known to git.
remote: 
remote: !       Heroku Git error, please try again shortly.
remote: !       See https://status.heroku.com for current Heroku platform status.
remote: !       If the problem persists, please open a ticket
remote: !       on https://help.heroku.com/tickets/new
remote: !       and provide the Request ID [redacted]
remote: 
To https://git.heroku.com/try-pushing-without-ssh-keys.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://git.heroku.com/try-pushing-without-ssh-keys.git'
```

Hm. Good news: push failed; bad news: the error message describes a failure other than the one I'm expecting. I'd prefer a message that more directly points to the problem. This could mean that I encountered a transitory failure, so I try again, giving the same result. This makes it more likely that either I'm failing to push for the right reason with a terrible error message _or_ Heroku happens to be having some problems right now. To rule out the second possibility, I check Heroku's status by visiting <https://status.heroku.com/>. The status report claims that everything is working, so if Heroku has a problem, then Heroku hasn't noticed yet. For the moment, then, I have to assume that my push is failing for the right reason, and now I need to learn how to specify my Heroku API key so that I have authorization to push to my Heroku repository. For this, I go back to reading <https://devcenter.heroku.com/articles/git#http-git-authentication>.

This articles tells me that everything should "work transparently" from my local environment, because I have previously used `heroku login` to establish my credentials with Heroku. I checked this by removing `heroku` references from `\$HOME/.netrc`, trying to push from the command line, and seeing Heroku ask me for a password. In other words, as soon as I use `heroku login`, Heroku considers me authenticated and lets me push from this environment. I don't want that, because I can't (and don't want to) type my Heroku password into a GitLab CI job in order to authenticate myself with Heroku. I need to know how to specify my Heroku API key some other way when pushing to Heroku. Sadly, the document I'm reading now doesn't tell me how to do that.

Fortunately, Stack Overflow gives me a clue. It tells me that I could try something like the following

```bash
$ git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git master
```

In order to test this, I first try doing this even with my Heroku credentials present in `.netrc`, to make sure that that works; and then I remove the Heroku credentials from `.netrc` to check whether that also works.

```bash
$ git push "https://heroku:$(heroku auth:token)@git.heroku.com/try-pushing-without-ssh-keys.git" master
Counting objects: 2, done.
Writing objects: 100% (2/2), 186 bytes | 0 bytes/s, done.
Total 2 (delta 0), reused 0 (delta 0)
remote: error: pathspec '.' did not match any file(s) known to git.
remote: 
remote: !       Heroku Git error, please try again shortly.
remote: !       See https://status.heroku.com for current Heroku platform status.
remote: !       If the problem persists, please open a ticket
remote: !       on https://help.heroku.com/tickets/new
remote: !       and provide the Request ID [redacted]
remote: 
To https://git.heroku.com/try-pushing-without-ssh-keys.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://heroku:[my-heroku-api-key]@git.heroku.com/try-pushing-without-ssh-keys.git'
```

Interesting! This tells me that the error message I saw probably has nothing to do with authentication, and that I need to fix that first.

### Chasing A Rabbit

One thing leaps to my mind: I have no files in this repository, just an empty commit, and perhaps Heroku does something in its standard `pre-receive` hook that assumes that there are file in the repository. I spend about 30 seconds searching the web looking for confirmation of this guess before trying to add files to the repository. I also conjecture that perhaps I need a minimally-viable Heroku app in order to pass Heroku's `pre-receive` check, so I might need to create something like a valid `Procfile` that just echoes "Hello, world!" to `stdout` in order for Heroku to accept my push. Right now, _I don't know the contract for Heroku to agree to accept my push_. I need to reverse-engineer some aspect of it. _Undocumented contracts kill._

I couldn't find anything definitive quickly, but from what I read, I infer that the error happens when Heroku tries to run `git checkout` on the repository, so I try to mimic the conditions under which `git checkout` would generate the error `error: pathspec '.' did not match any file(s) known to git.`

```bash
$ cd $CHECK_PUSH_PROJECT_ROOT
$ git checkout master
# That works
$ git checkout .
error: pathspec '.' did not match any file(s) known to git.
# Interesting! Does this always happen, or does this relate to not having any files?
$ git checkout -b diagnose-git-pathspec-error
Switched to a new branch 'diagnose-git-pathspec-error'
$ touch i_need_a_file.txt
$ git add -A
$ git commit -m "I need a file to see what happens when I try to checkout the current directory."
$ git checkout .
# That works!
$ git checkout master
# There are no files on this branch.
$ git checkout .
error: pathspec '.' did not match any file(s) known to git.
# Aha!
```

OK, so it seems that Heroku's `pre-receive` hook _assumes_ that there are files in the branch that we push to it. Good to know.

>   Don't get me wrong: "files exist on this branch" is a perfectly reasonable requirement in the contract for a module consuming a push from another Git repository; but it would be even nicer if either (1) the receiving repository didn't have this requirement or (2) the receiving repository produced a better message when someone violates the contract.
>
>   This feels similar to a function that accepts a collection, and then fails when it receives an empty collection, even though it could safely silently do nothing in that case. Worse, when that function fails with a generic "no such element" error.

Now I feel more confident that, if I add a file to this repository, then push, that the push will pass Heroku's `pre-receive` hook and I'll more easily distinguish an authentication success from an authentication failure. Just for the sake of avoiding another rabbit-hole, I'll add a `Procfile` that does nothing interesting.

```bash
# Procfile
web: echo "Hello, world"
```

```bash
$ cd $CHECK_PUSH_PROJECT_ROOT
$ git add -A
$ git commit -m "Heroku won't accept a push unless the branch has files on it."
$ git push "https://heroku:$(heroku auth:token)@git.heroku.com/try-pushing-without-ssh-keys.git" master
Counting objects: 5, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (5/5), 459 bytes | 0 bytes/s, done.
Total 5 (delta 0), reused 0 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote: 
remote:  !     No default language could be detected for this app.
remote:                         HINT: This occurs when Heroku cannot detect the buildpack to use for this application automatically.
remote:                         See https://devcenter.heroku.com/articles/buildpacks
remote: 
remote:  !     Push failed
remote: Verifying deploy....
remote: 
remote: !       Push rejected to try-pushing-without-ssh-keys.
remote: 
To https://git.heroku.com/try-pushing-without-ssh-keys.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://heroku:[my-heroku-api-key]@git.heroku.com/try-pushing-without-ssh-keys.git'
```

OK… I can live with this. Although Heroku rejects the app, _it is clear enough to me for right now_ that authentication has succeeded—which I had as a goal—and I don't care enough to explore how to build a minimal Heroku app, which appears to involve _at least_ specifying a buildpack. For now, I will interpret this result as "authentication passed", and as long as I can confidently interpret a result as having got past the authentication step, I won't push for a more obvious success response.

Now… where was I? Oh yes, _we can push to Heroku using the API Key, as long as we also have the right Heroku credentials stored in the local environment_, in this case, in the file `\$HOME/.netrc` from having previously successfully logged in to Heroku using the Heroku CLI tool. Now, let's weaken the assumption.

```bash
$ heroku logout
Local credentials cleared.
$ git push https://git.heroku.com/try-pushing-without-ssh-keys.git master
[Evidence that we connected, and so authentication passed.]
```

FAILED. I don't know whether this means that I somehow still magically have credentials stored locally (where?!) _or_ that Heroku is remembering my previously-successful authentication. I can check the latter by destroying the Heroku app and creating a new one, then trying to push to the new Heroku app without the Heroku API key, and expecting authentication to fail.

```bash
$ heroku login
[Enter credentials...]
$ heroku apps:delete try-pushing-without-ssh-keys --confirm try-pushing-without-ssh-keys
Destroying ⬢ try-pushing-without-ssh-keys (including all add-ons)... done
$ heroku logout
Local credentials cleared.
```

Now, _just to be sure_, I create the Heroku app on the web, so that I don't accidentally store my Heroku credentials locally. I created an app called `try-pushing-with-api-key`.

```bash
$ cd $CHECK_PUSH_PROJECT_ROOT
$ git push https://git.heroku.com/try-pushing-with-api-key.git master
```

…and that worked just fine, too. This leads me to conclude either that Heroku is remembering my authentication with the API key _or_ that HTTPS Git transport lets me push without authentication. Now, it makes sense to me that, since HTTPS Git transport uses HTTP basic authentication, that there is some period during which Heroku's server remembers my authentication credentials, which normally helps me, but right now hurts me. Of course, I don't know this timeout period, so I have no idea how long to wait until I can try this again and get responses that I expect and can safely interpret. If I had to guess, I'd say 15 or 30 minutes, maybe 1 hour.

Annoying. I guess I have to wait for 2 hours, just to be sure that Heroku's server has forgot my credentials.

Well… let me check this. If I can push to this repository over HTTPS Git transport from the GitLab CI runner, then that changes the game on me, and I'd rather learn that now than wait 2 hours to run yet another inconclusive test.

Even better, before I go through all that, I probably only need to push to this Heroku repository _from a different IP address_, because Heroku wouldn't associate that client with my currently-cached credentials. I don't have to go through GitLab CI for this; I can use my Rackspace account, because that machine does not reside behind my home router.

```bash
$ ssh [my-rackspace-account-address]
$ cd $WORKSPACE_ROOT
$ git init try-pushing-to-heroku-from-somewhere-else
$ cd try-pushing-to-heroku-from-somewhere-else
$ git push https://git.heroku.com/try-pushing-with-api-key.git master
# Oops, there's probably not even a master branch yet.
$ git branch
# nothing
$ git commit --allow-empty -m "Create me a master branch, please."

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: empty ident name (for <jbrains@quincy.(none)>) not allowed
# Ugh! I'll add an identity just for this repository.
$ git config user.email "me@jbrains.ca"
$ git config user.name "J. B. Rainsberger"
# Try again.
$ git commit --allow-empty -m "Create me a master branch, please."
# Done.
$ git branch
* master
$ git push https://git.heroku.com/try-pushing-with-api-key.git master
Username for 'https://git.heroku.com': 
[CTRL+C]
```

PASSED. Heroku's server correctly demanded a password, so it is almost certainly the case that Heroku has cached credentials related to my local environment, and I can't continue testing from my local environment until Heroku removes those credentials from its cache. However, I _can_ use my Rackspace account to try pushing with the Heroku API key, since Heroku clearly isn't magically authenticating me some other way.

```bash
# Still logged in to my Rackspace account
$ git push https://heroku:[my-heroku-api-key]@git.heroku.com/try-pushing-with-api-key.git master
Counting objects: 2, done.
Writing objects: 100% (2/2), 180 bytes | 0 bytes/s, done.
Total 2 (delta 0), reused 0 (delta 0)
remote: error: pathspec '.' did not match any file(s) known to git.
# ...and so on
```

PASSED. Authentication passed, even though Heroku rejected the push because it has no files.

### The Thrilling Conclusion

In order to push to a Heroku Git repository with just the Heroku API key, do this:

```bash
$ cd $YOUR_PROJECT_ROOT
$ git push https://heroku:$(HEROKU_API_KEY)@git.heroku.com/$(HEROKU_APP_NAME).git $(LOCAL_BRANCH_TO_PUSH)
```

Wonderful! I can easily do this. Now, _in order to feel the feeling of completion_, I want to try this right away!

## Pushing To Heroku From GitLab CI

In order to make this work more nicely, I'd like Heroku to accept the push, which means delivering a minimal Heroku app. For this, I added the Ruby buildpack to my Heroku app and I created a `Procfile` that ran a "Hello, world" app using Ruby.

```bash
# Procfile
worker: bundle exec ruby -e "puts 'Hello, world.'"
```

If this fails, then at least I can try the same thing from my local microtesting environment, and then figure out how to make it run through GitLab CI. I have, however, become impatient for a final result, so I'll try running this directly in GitLab CI and hope for the best. This step either ends my learning or leads to taking a long break involving alcohol.

This time, however, I have to be careful, because Heroku wants me to push to the branch `master`, but I've been using various branches for various tests, so I need to control the branch I'm on.

```bash
# .gitlab-ci.yml
before_script:
  - git config user.email "gitlab-ci-client@jbrains.ca"
  - git config user.name "GitLab CI on behalf of J. B. Rainsberger"

push_to_heroku:
  script:
    # I need to control which Git branch I'm on in order to push to Heroku
    - git checkout -b publish-to-heroku
    - git commit --allow-empty -m "Test pushing to Heroku at $(date)"
    - git branch -v
    - git push https://heroku:[my-heroku-api-key]@git.heroku.com/try-pushing-with-api-key.git publish-to-heroku:master

```

And now...

```bash
$ cd $PROJECT_ROOT
$ git add -A
$ git status -s
M  .gitlab-ci.yml
A  Procfile
$ git commit -m "Test deploying a dead-simple Ruby app from GitLab CI to Heroku"
$ git push --all gitlab
$ open https://gitlab.com/jbrains/learn-gitlab-ci/pipelines?scope=running
```

PASSED.

Here is the contract of using GitLab CI to deploy to Heroku, as far as I can tell.

+   The GitLab CI build job has to control or detect which branch it's on in order to push the correct branch to Heroku as `master`.
+   The build job has to push an app that Heroku can detect, build, and run. (Clearly.)
+   The build job has to push to Heroku using the Heroku API key.

Before declaring victory, however, there remains the problem of hardcoding the Heroku API key in my GitLab CI configuration file. I will need to come back and read <https://docs.gitlab.com/ce/ci/variables/README.html#secret-variables> to learn more about that. For now, it's time for a break.

#### Future Work

+   Introduce secret variable for the Heroku API key.
+   Introduce a "production" environment to make room for things like staging/preview/whatever.

### Keeping the Heroku API Key Secret

According to the documentation at <https://docs.gitlab.com/ce/ci/variables/README.html#secret-variables>, I change a GitLab-project-level setting, listed under **Settings > CI/CD Pipeline > Secret Variables**. (I had to contribute to GitLab's documentation in order to clarify where to find that setting, since it had moved.) I introduced the Heroku API Key as a secret variable, then changed the GitLab CI configuration file accordingly.

```bash
# .gitlab-ci.yml
before_script:
  - git config user.email "gitlab-ci-client@jbrains.ca"
  - git config user.name "GitLab CI on behalf of J. B. Rainsberger"

push_to_heroku:
  script:
    # I need to control which Git branch I'm on in order to push to Heroku
    - git checkout -b publish-to-heroku
    - git commit --allow-empty -m "Test pushing to Heroku at $(date)"
    - git branch -v
    - git push --force https://heroku:$HEROKU_API_KEY@git.heroku.com/try-pushing-with-api-key.git publish-to-heroku:master
```

I should note that I also had to add `--force` to my `git push` command, because I'm not necessarily keeping my local repository synchronized with the Heroku app's repository.

## I Think I Have All The Pieces

Now, I think I have all the pieces to do the thing that I wanted to do with GitLab CI in the first place. I think I'm ready to run an end-to-end test. For that, I need the following.

+   A Jekyll project in my local development environment.
+   A GitLab repository to act as the intermediary between development and production.
+   A Heroku app able to run Jekyll as a Rack app, for which the Rack/Jekyll buildpack will come in handy.

### Create A Local Jekyll Project

I chose a Jekyll theme arbitrarily, just for interest.

```bash
# In my local environment, which is my MacBook
$ cd $WORKSPACE_ROOT
$ git clone https://github.com/lukas-h/onepage.git try-deploy-jekyll-to-heroku-through-gitlab
$ cd try-deploy-jekyll-to-heroku-through-gitlab
# Does it work at all?
# There's no Gemfile. Weird. Let's create one.
```

```ruby
# Gemfile
source "https://rubygems.org"

ruby "2.3.3"

gem "jekyll"
```

```bash
$ bundle install
# Bundler easily installs gems.
$ bundle exec jekyll serve
# Open https://127.0.0.1:4000 in a browser
# It works!
$ git add -A
$ git commit -m "We can now serve the Jekyll site."
```

Now that I've confirmed that the Jekyll app works, it's time to prepare it for deployment to Heroku, by making it a Rack app.

I visited <https://adaoraul.github.io/rack-jekyll/> and followed the instructions: adding the gem and creating `config.ru`.

```ruby
# Gemfile
source "https://rubygems.org"

ruby "2.3.3"

gem "jekyll"
gem "rack-jekyll"
```

```ruby
# config.ru
require "rack/jekyll"
run Rack::Jekyll.new
```

```ruby
# _config.yml
# skip a bunch of stuff...
exclude:
  - LICENSE
  - README.md
  - vendor
  - Gemfile
  - Gemfile.lock
  - config.ru
```

```bash
# In the local environment
$ bundle install
# Bundler installs Rack/Jekyll
# Does it work?
$ bundle exec rackup
# Open https://127.0.0.1:9292 in a browser
# It works!
$ git add -A
$ git commit -m "We can now serve the Jekyll site as a Rack app"
```

### Create a Heroku App

I visited <https://www.heroku.com> and created an app named `arbitrary-jekyll-site`, to which I added the buildpack at <https://github.com/heroku/heroku-buildpack-ruby.git>. I visited <https://arbitrary-jekyll-site.herokuapp.com/> to verify that the Heroku app works at all. Next, I verify that I can deploy to Heroku from my local environment.

```bash
# In the local environment
$ export HEROKU_API_KEY=none-of-your-business
$ git remote add production https://heroku:$HEROKU_API_KEY@git.heroku.com/arbitrary-jekyll-site.git
$ git push production master
# Open https://arbitrary-jekyll-site.herokuapp.com/ in a browser
```

It works!

### Create a GitLab Project

I visited <https://www.gitlab.com> and created a GitLab project called `deploy-jekyll-to-heroku-using-gitlab-ci`. I then added it as a remote to the Jekyll project in my local environment.

```bash
# In the local environment
$ git remote add gitlab git@gitlab.com:jbrains/deploy-jekyll-to-heroku-using-gitlab-ci.git
# Let's see if this works at all!
$ git push --all -u gitlab
# Yay!
```


### Set Up GitLab CI

First, I set up the secret variable representing the Heroku API key under the new GitLab project CI/CD pipeline.

Next, I can use that secret variable to configure GitLab CI.

```yaml
# .gitlab-ci.yml
before_script:
  - git config user.email "gitlab-ci-client@jbrains.ca"
  - git config user.name "GitLab CI on behalf of J. B. Rainsberger"

push_to_heroku:
  variables:
    # I need to control which Git branch I'm on in order to push to Heroku
    publication_branch_name: "publish-to-heroku"

  script:
    - git checkout -b $publication_branch_name
    - git commit --allow-empty -m "Publish to Heroku at $(date)"
    - git push --force https://heroku:$HEROKU_API_KEY@git.heroku.com/arbitrary-jekyll-site.git $publication_branch_name:master
```

Next, I commit everything and push it to GitLab, then wait for the fireworks!

```bash
$ git add -A
$ git commit -m "GitLab CI now deploys to Heroku."
$ git push gitlab
```

Now I wait two minutes for the GitLab CI pipeline to finish its work. With any luck, we see evidence of a new Heroku deployment.

…and we do! I visit <https://arbitrary-jekyll-site.herokuapp.com/> in my browser and see a web application.

## Change The Jekyll Site, Change The Production Web Site

This remains the final end-to-end test before I declare victory.

```bash
# In the local environment
$ mvim _posts/2017-02-13-hello-world.markdown
```

```markdown
# _posts/2017-02-13-hello-world.markdown
---
title: "Hello, World!"
date: 2017-02-13
---
# Hello, World!
```

```bash
# In the local environment
$ bundle exec jekyll serve
# Open https://localhost:4000/ and check for the new post
# I see it!
[CTRL+C]
$ git add -A
$ git commit -m "Wrote a shiny new post."
$ git push gitlab
# Wait two minutes
# Open https://arbitrary-jekyll-site.herokuapp.com/ and check for the new post
# I see it!
```

Finally… it all works.

## Clean Up Before Moving On

```bash
# In the local environment
$ git remote rm production
# ...because now GitLab does this for us
$ git remote rm origin
# ...because I don't intend to contribute back to the theme
$ git remote -v
gitlab  git@gitlab.com:jbrains/deploy-jekyll-to-heroku-using-gitlab-ci.git (fetch)
gitlab  git@gitlab.com:jbrains/deploy-jekyll-to-heroku-using-gitlab-ci.git (push)
# That's it!
```

I finish by removing the Heroku apps and GitLab projects that I no longer need. Now I can do this for real, and after I do it for real, then I can remove these test apps and projects. This document should suffice for recreating everything if I need to.

That was almost fun.

