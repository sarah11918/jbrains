---
title: "Surely the Mars rover needed integrated tests! (Maybe not?)"
date: 2009-09-30
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
## The 30-second version

* I can find integration problems of basic correctness without integrated tests using a simple double-entry book-keeping approach.
* I use test doubles to articulate the assumptions I make in my design; these become tests for the next layer.
* You don't need to do TDD to use this technique: you can use it when adding tests to existing or legacy code.
* This technique makes rescuing legacy code easier, since you can write more tests without having to deploy the system in its usual runtime environment.
* Most programmers write good collaboration tests, but forget to write contract tests, and that creates integration problems, so write contract tests!

## The Details

<p>&#8220;Guest&#8221; commented about my Agile 2009 tutorial, Integration Tests Are A Scam. &#8220;Guest&#8221; wrote this:</p>
<blockquote style="font-style: italic;"><span class="drop-quote">&#8220;</span>A Mars rover mission failed because of a lack of integrated tests. The parachute system was successfully tested. The system that detaches the parachute after the landing was successfully &#8211; but independently &#8211; tested. On Mars when the parachute successfully opened the deceleration &#8220;jerked&#8221; the lander, then the detachment system interpreted the jerking as a landing and successfully detached the parachute. Oops. Integration tests may be costly but they are absolutely necessary.</p>
</blockquote>
<p>I don&#8217;t doubt the necessity of integrated tests. I depend on them to solve difficult system-level problems. By contrast, I routinely see teams using them to detect unexpected consequences, and I don&#8217;t think we need them for that purpose. I prefer to use them to confirm an uneasy feeling that an unintended consequence lurks.</p>
<p>Let&#8217;s consider a clean implementation of the situation my commenter describes. I see this design, comprising the lander, the parachute, the detachment system, an accelerometer and an altimeter. A controller connects all these things together. Let&#8217;s look at the &#8220;code&#8221;, which I&#8217;ve written in a fantasy language that looks a little like Java/C# and a little like Ruby.</p>
<blockquote style="font-size: small;">
<p style="font-size: small;">Ashley Moran has posted a working Ruby version of this example. If you speak Ruby, then I highly recommend <a href="https://link.jbrains.ca/1uOh366">looking at that example</a> after you&#8217;ve read this.}</p>
</blockquote>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css">
<div id="gist-185020" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">Controller.initialize() {               </div><div class="line" id="LC2">&nbsp;&nbsp;parachute = Parachute.new(lander)</div><div class="line" id="LC3">&nbsp;&nbsp;detachment_system = DetachmentSystem.new(parachute)</div><div class="line" id="LC4">&nbsp;&nbsp;accelerometer = Accelerometer.new()</div><div class="line" id="LC5">&nbsp;&nbsp;lander = Lander.new(accelerometer, Altimeter.new())</div><div class="line" id="LC6">&nbsp;&nbsp;accelerometer.add_observer(detachment_system)</div><div class="line" id="LC7">}  </div><div class="line" id="LC8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="line" id="LC9">Parachute {</div><div class="line" id="LC10">&nbsp;&nbsp;needs a lander</div><div class="line" id="LC11">&nbsp;&nbsp;</div><div class="line" id="LC12">&nbsp;&nbsp;open() {</div><div class="line" id="LC13">&nbsp;&nbsp;&nbsp;&nbsp;lander.decelerate()</div><div class="line" id="LC14">&nbsp;&nbsp;}             </div><div class="line" id="LC15">&nbsp;&nbsp;</div><div class="line" id="LC16">&nbsp;&nbsp;detach() {</div><div class="line" id="LC17">&nbsp;&nbsp;&nbsp;&nbsp;if (lander.has_landed == false)</div><div class="line" id="LC18">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raise &quot;You broke the lander, idiot.&quot;</div><div class="line" id="LC19">&nbsp;&nbsp;}</div><div class="line" id="LC20">}      </div><div class="line" id="LC21">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="line" id="LC22">AccelerationObserver is a role {</div><div class="line" id="LC23">&nbsp;&nbsp;handle_acceleration_report(acceleration) {</div><div class="line" id="LC24">&nbsp;&nbsp;&nbsp;&nbsp;raise &quot;Subclass responsibility&quot;</div><div class="line" id="LC25">&nbsp;&nbsp;}</div><div class="line" id="LC26">}</div><div class="line" id="LC27">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="line" id="LC28">DetachmentSystem acts as AccelerationObserver {</div><div class="line" id="LC29">&nbsp;&nbsp;needs a parachute</div><div class="line" id="LC30">&nbsp;&nbsp;</div><div class="line" id="LC31">&nbsp;&nbsp;handle_acceleration_report(acceleration) {}</div><div class="line" id="LC32">&nbsp;&nbsp;&nbsp;&nbsp;if (acceleration &lt;= -50.ms2) {</div><div class="line" id="LC33">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parachute.detach()</div><div class="line" id="LC34">&nbsp;&nbsp;&nbsp;&nbsp;}</div><div class="line" id="LC35">&nbsp;&nbsp;}</div><div class="line" id="LC36">}               </div><div class="line" id="LC37">&nbsp;</div><div class="line" id="LC38">Accelerometer acts as Observable {</div><div class="line" id="LC39">&nbsp;&nbsp;manages many acceleration_observers</div><div class="line" id="LC40">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="line" id="LC41">&nbsp;&nbsp;report_acceleration(acceleration) {</div><div class="line" id="LC42">&nbsp;&nbsp;&nbsp;&nbsp;acceleration_observers.each() {</div><div class="line" id="LC43">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;each.handle_acceleration_report(acceleration)</div><div class="line" id="LC44">&nbsp;&nbsp;&nbsp;&nbsp;}</div><div class="line" id="LC45">&nbsp;&nbsp;}</div><div class="line" id="LC46">}</div><div class="line" id="LC47">&nbsp;</div><div class="line" id="LC48">Lander {</div><div class="line" id="LC49">&nbsp;&nbsp;needs an accelerometer  </div><div class="line" id="LC50">&nbsp;&nbsp;needs an altimeter</div><div class="line" id="LC51">&nbsp;&nbsp;</div><div class="line" id="LC52">&nbsp;&nbsp;decelerate() {</div><div class="line" id="LC53">&nbsp;&nbsp;&nbsp;&nbsp;// I know how much to decelerate by</div><div class="line" id="LC54">&nbsp;&nbsp;&nbsp;&nbsp;accelerometer.report_acceleration(how_much)</div><div class="line" id="LC55">&nbsp;&nbsp;}</div><div class="line" id="LC56">}</div><div class="line" id="LC57">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185020/029126795025ebc095f05ef97b39af4ee0479c99/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185020">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>I need to test what happens when I open the parachute. The lander should decelerate.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185026" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testOpenParachute() { </div><div class="line" id="LC2">&nbsp;&nbsp;parachute = Parachute.new(lander = mock(Lander))</div><div class="line" id="LC3">&nbsp;&nbsp;lander.expects().decelerate() </div><div class="line" id="LC4">&nbsp;&nbsp;</div><div class="line" id="LC5">&nbsp;&nbsp;parachute.open() </div><div class="line" id="LC6">}</div><div class="line" id="LC7">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185026/1f16f2e2e3513fdfb0e9434d2b3610353fd4a141/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185026">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Since this test expects the lander to decelerate, I have to test that. When the lander decelerates, the accelerometer should report its deceleration.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185027" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testLanderDecelerates() {                  </div><div class="line" id="LC2">&nbsp;&nbsp;accelerometer = mock(Accelerometer)</div><div class="line" id="LC3">&nbsp;&nbsp;lander = Lander.new(accelerometer)</div><div class="line" id="LC4">&nbsp;&nbsp;accelerometer.expects().report_acceleration(-50.ms2)</div><div class="line" id="LC5">&nbsp;&nbsp;</div><div class="line" id="LC6">&nbsp;&nbsp;lander.decelerate()</div><div class="line" id="LC7">}</div><div class="line" id="LC8">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185027/1ddf011da15152df20d4eba65e1b57ac94a638d0/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185027">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Since this test shows that the accelerometer can report acceleration of &minus;50 m/s<sup>2</sup>, I have to test that.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185029" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testAccelerometerCanReportRapidAcceleration() {</div><div class="line" id="LC2">&nbsp;&nbsp;accelerometer = Accelerometer.new()</div><div class="line" id="LC3">&nbsp;&nbsp;accelerometer.add_observer(observer = mock(AccelerationObserver))</div><div class="line" id="LC4">&nbsp;&nbsp;observer.expects().handle_acceleration_report(-50.ms2)</div><div class="line" id="LC5">&nbsp;&nbsp;</div><div class="line" id="LC6">&nbsp;&nbsp;accelerometer.report_acceleration(-50.ms2)</div><div class="line" id="LC7">}                                          </div><div class="line" id="LC8">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185029/1f0bb87f14af33b5a1e361084f9d7681966d8216/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185029">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Since this test shows that any acceleration observer must be prepared to handle an acceleration report of &minus;50 m/s<sup>2</sup>, I have to test that.</p>
<p>First, the general test for the contract of the interface:</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185030" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">AccelerationObserverTest {</div><div class="line" id="LC2">&nbsp;&nbsp;testAccelerationObserverCanHandleRapidAcceleration() {</div><div class="line" id="LC3">&nbsp;&nbsp;&nbsp;&nbsp;observer = create_acceleration_observer() // subclass responsibility</div><div class="line" id="LC4">&nbsp;&nbsp;&nbsp;&nbsp;this_block {</div><div class="line" id="LC5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;observer.handle_acceleration_report(-50.ms2)</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;}.should execute_without_incident</div><div class="line" id="LC7">&nbsp;&nbsp;}                                                      </div><div class="line" id="LC8">}</div><div class="line" id="LC9">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185030/0153625081492a73e556d06b394751ac7b60779e/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185030">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Now the test for <code>DetachmentSystem</code>, which acts as an <code>AccelerationObserver</code>. What should it do if it detects such sudden deceleration? It should detach the parachute.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185031" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">DetachmentSystemTest extends AccelerationObserverTest {</div><div class="line" id="LC2">&nbsp;&nbsp;// I inherit  testAccelerationObserverCanHandleRapidAcceleration()</div><div class="line" id="LC3">&nbsp;&nbsp;</div><div class="line" id="LC4">&nbsp;&nbsp;create_acceleration_observer() {</div><div class="line" id="LC5">&nbsp;&nbsp;&nbsp;&nbsp;DetachmentSystem.new(parachute = mock(Parachute))</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;parachute.expects().detach()</div><div class="line" id="LC7">&nbsp;&nbsp;}</div><div class="line" id="LC8">}</div><div class="line" id="LC9">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185031/67c2a266c7c9a5295d185869eb8abd338a13d770/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185031">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>You might find that easier to read this way, by inlining the method <code>create_acceleration_observer()</code>:</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185032" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">DetachmentSystemTest {</div><div class="line" id="LC2">&nbsp;&nbsp;testRespondsToRapidAcceleration() {</div><div class="line" id="LC3">&nbsp;&nbsp;&nbsp;&nbsp;detachment_system = DetachmentSystem.new(parachute = mock(Parachute))</div><div class="line" id="LC4">&nbsp;&nbsp;&nbsp;&nbsp;parachute.expects().detach()</div><div class="line" id="LC5">&nbsp;&nbsp;&nbsp;&nbsp;this_block {</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;detachment_system.handle_acceleration_report(-50.ms2)</div><div class="line" id="LC7">&nbsp;&nbsp;&nbsp;&nbsp;}.should execute_without_incident</div><div class="line" id="LC8">&nbsp;&nbsp;}</div><div class="line" id="LC9">}                              </div><div class="line" id="LC10">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185032/9af808918a355eed88b3989b0b8b98ad5673194f/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185032">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Since this test expects the parachute to be able to detach, I have to test that. Now, detaching only works if we&#8217;ve landed. (I&#8217;ve simplified on purpose. Suppose the parachute can&#8217;t survive a drop from any height. It&#8217;s easy to add that detail in later.)</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185033" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">ParachuteTest {</div><div class="line" id="LC2">&nbsp;&nbsp;testDetachingWhileLanded() {</div><div class="line" id="LC3">&nbsp;&nbsp;&nbsp;&nbsp;parachute = Parachute.new(lander = mock(Lander))</div><div class="line" id="LC4">&nbsp;&nbsp;&nbsp;&nbsp;lander.stubs().has_landed().to_return(true)    </div><div class="line" id="LC5">&nbsp;&nbsp;&nbsp;&nbsp;this_block {</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parachute.detach()</div><div class="line" id="LC7">&nbsp;&nbsp;&nbsp;&nbsp;}.should execute_without_incident</div><div class="line" id="LC8">&nbsp;&nbsp;}</div><div class="line" id="LC9">&nbsp;&nbsp;</div><div class="line" id="LC10">&nbsp;&nbsp;testDetachingWhileNotLanded() {</div><div class="line" id="LC11">&nbsp;&nbsp;&nbsp;&nbsp;parachute = Parachute.new(lander = mock(Lander))</div><div class="line" id="LC12">&nbsp;&nbsp;&nbsp;&nbsp;lander.stubs().has_landed().to_return(false)</div><div class="line" id="LC13">&nbsp;&nbsp;&nbsp;&nbsp;this_block {</div><div class="line" id="LC14">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parachute.detach()</div><div class="line" id="LC15">&nbsp;&nbsp;&nbsp;&nbsp;}.should raise(&quot;You broke the lander, idiot.&quot;)</div><div class="line" id="LC16">&nbsp;&nbsp;}</div><div class="line" id="LC17">}</div><div class="line" id="LC18">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185033/d566e795af04db2dc29e0da17b3cf8f8f8800b9d/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185033">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Hm. I notice that <code>parachute.detach()</code> might fail. But I just wrote a test that uses <code>parachute.detach()</code> and doesn&#8217;t yet show how it handles that method failing. I have to test that.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185034" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">DetachmentSystemTest {</div><div class="line" id="LC2">&nbsp;&nbsp;testRespondsToDetachFailing() {</div><div class="line" id="LC3">&nbsp;&nbsp;&nbsp;&nbsp;detachment_system = DetachmentSystem.new(parachute = mock(Parachute))</div><div class="line" id="LC4">&nbsp;&nbsp;&nbsp;&nbsp;parachute.stubs().detach().to_raise(AnyException)</div><div class="line" id="LC5">&nbsp;</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;this_block {</div><div class="line" id="LC7">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;detachment_system.handle_acceleration_report(-50.ms2)</div><div class="line" id="LC8">&nbsp;&nbsp;&nbsp;&nbsp;}.should raise(AnyException)</div><div class="line" id="LC9">&nbsp;&nbsp;}</div><div class="line" id="LC10">}</div><div class="line" id="LC11">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185034/73eefaab8529f4a26a0488a6d34afe2e819286ed/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185034">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Hm. So handling an acceleration report of &minus;50 m/s<sup>2</sup> can fail. Who might issue such a right? The accelerometer. Since the detach system doesn&#8217;t handle this failure, I have to test what the accelerometer does when issuing an acceleration report might fail.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185035" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testAccelerometerCanRespondToFailureWhenReportingAcceleration() {</div><div class="line" id="LC2">&nbsp;&nbsp;accelerometer = Accelerometer.new()</div><div class="line" id="LC3">&nbsp;&nbsp;accelerometer.add_observer(observer = mock(AccelerationObserver))</div><div class="line" id="LC4">&nbsp;&nbsp;observer.stubs().handle_acceleration_report().to_raise(AnyException)</div><div class="line" id="LC5">&nbsp;</div><div class="line" id="LC6">&nbsp;&nbsp;this_block {</div><div class="line" id="LC7">&nbsp;&nbsp;&nbsp;&nbsp;accelerometer.report_acceleration(-50.ms2)</div><div class="line" id="LC8">&nbsp;&nbsp;}.should raise(AnyException)</div><div class="line" id="LC9">}</div><div class="line" id="LC10">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185035/c86ed2c04981ab8050efe82ee530327449dde4f7/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185035">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>It turns out that the accelerometer might fail when reporting acceleration of &minus;50 m/s<sup>2</sup>. When might it do that? When the lander decelerates. What happens then?</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185036" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testLanderDeceleratesRespondsToFailure() {                  </div><div class="line" id="LC2">&nbsp;&nbsp;accelerometer = mock(Accelerometer)</div><div class="line" id="LC3">&nbsp;&nbsp;lander = Lander.new(accelerometer)</div><div class="line" id="LC4">&nbsp;&nbsp;accelerometer.stubs().report_acceleration().to_raise(AnyException)</div><div class="line" id="LC5">&nbsp;</div><div class="line" id="LC6">&nbsp;&nbsp;this_block {</div><div class="line" id="LC7">&nbsp;&nbsp;&nbsp;&nbsp;lander.decelerate()</div><div class="line" id="LC8">&nbsp;&nbsp;}.should raise(AnyException)</div><div class="line" id="LC9">}</div><div class="line" id="LC10">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185036/eb192b978d1f3caa931ff1cfaaa1f296e45724d1/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185036">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Hm. So decelerating could fail! All right, who causes the lander to decelerate? That code might fail. Oh yes&#8230; the parachute opening!</p>
<link rel="stylesheet" href="://gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185037" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testOpenParachuteRespondsToFailure() { </div><div class="line" id="LC2">&nbsp;&nbsp;parachute = Parachute.new(lander = mock(Lander))</div><div class="line" id="LC3">&nbsp;&nbsp;lander.stubs().decelerate().to_raise(AnyException)</div><div class="line" id="LC4">&nbsp;&nbsp;</div><div class="line" id="LC5">&nbsp;&nbsp;this_block {</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;parachute.open() </div><div class="line" id="LC7">&nbsp;&nbsp;}.should raise(AnyException)</div><div class="line" id="LC8">}  </div><div class="line" id="LC9">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185037/f3f719d33f6d216cb73c194e59bf1e899226205a/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185037">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>So opening the parachute could fail! We probably want to nail down when that happens. We have a test that shows us when:</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185038" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testDetachingWhileNotLanded() {</div><div class="line" id="LC2">&nbsp;&nbsp;parachute = Parachute.new(lander = mock(Lander))</div><div class="line" id="LC3">&nbsp;&nbsp;lander.stubs().has_landed().to_return(false)</div><div class="line" id="LC4">&nbsp;&nbsp;this_block {</div><div class="line" id="LC5">&nbsp;&nbsp;&nbsp;&nbsp;parachute.detach()</div><div class="line" id="LC6">&nbsp;&nbsp;}.should raise(&quot;You broke the lander, idiot.&quot;)</div><div class="line" id="LC7">}</div><div class="line" id="LC8">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185038/9a3256c986335fe66e3fbd06fbbde7f8a5a6365c/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185038">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>So the parachute opening could cause it to detach because the lander hasn&#8217;t landed yet. I don&#8217;t know about you, but I think the parachute provides the most value when its helps the lander land, and not once it has landed. That tells me that someone, somewhere needs to handle the exception that <code>detach()</code> would raise, or at least prevent <code>detach()</code> from happening while the altimeter reads above a few meters off the ground.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185039" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testDoNotDetachWhenTheLanderIsTooHighUp() {</div><div class="line" id="LC2">&nbsp;&nbsp;altimeter = mock(Altimeter)</div><div class="line" id="LC3">&nbsp;&nbsp;altimeter.stubs().altitude().to_return(5.m)</div><div class="line" id="LC4">&nbsp;&nbsp;</div><div class="line" id="LC5">&nbsp;&nbsp;DetachmentSystem.new(parachute = mock(Parachute))</div><div class="line" id="LC6">&nbsp;&nbsp;parachute.expects(no_invocations_of).detach()</div><div class="line" id="LC7">&nbsp;&nbsp;</div><div class="line" id="LC8">&nbsp;&nbsp;detachment_system.handle_acceleration_report(-50.ms2)</div><div class="line" id="LC9">&nbsp;&nbsp;</div><div class="line" id="LC10">&nbsp;&nbsp;// ???</div><div class="line" id="LC11">}</div><div class="line" id="LC12">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185039/36dc5b6ee47ebbf219b808b39f474c3636ceb766/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185039">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>In writing this test, I see that in order to stop the detachment system from telling the parachute to detach, it needs access to the altimeter.</p>
<p><strong>Integration problem detected.</strong></p>
<p>When I wire the detachment system up to the altimeter, even the collaboration test shows how to ensure that the parachute doesn&#8217;t detach in this kind of dangerous situation.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185040" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">testDoNotDetachWhenTheLanderIsTooHighUp() {</div><div class="line" id="LC2">&nbsp;&nbsp;DetachmentSystem.new(parachute = mock(Parachute), altimeter = mock(Altimeter))</div><div class="line" id="LC3">&nbsp;&nbsp;altimeter.stubs().altitude().to_return(5.m)</div><div class="line" id="LC4">&nbsp;&nbsp;parachute.expects(no_invocations_of).detach()</div><div class="line" id="LC5">&nbsp;&nbsp;</div><div class="line" id="LC6">&nbsp;&nbsp;detachment_system.handle_acceleration_report(-50.ms2)</div><div class="line" id="LC7">}</div><div class="line" id="LC8">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185040/28e7056741f7b7197816dddb2151b2af269c22a5/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185040">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>This means I have to add the following production behavior.</p>
<link rel="stylesheet" href="//gist.github.com/stylesheets/gist/embed.css"/><div id="gist-185041" class="gist">
<div class="gist-file">
<div class="gist-data gist-syntax">
<div class="gist-highlight"><pre><div class="line" id="LC1">DetachmentSystem acts as AccelerationObserver {</div><div class="line" id="LC2">&nbsp;&nbsp;needs a parachute</div><div class="line" id="LC3">&nbsp;&nbsp;needs an altimeter // NEW!</div><div class="line" id="LC4">&nbsp;&nbsp;</div><div class="line" id="LC5">&nbsp;&nbsp;handle_acceleration_report(acceleration) {}</div><div class="line" id="LC6">&nbsp;&nbsp;&nbsp;&nbsp;if (acceleration &lt;= -50.ms2 and altimeter.altitude() &lt; 5.m) {</div><div class="line" id="LC7">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parachute.detach()</div><div class="line" id="LC8">&nbsp;&nbsp;&nbsp;&nbsp;}</div><div class="line" id="LC9">&nbsp;&nbsp;}</div><div class="line" id="LC10">}               </div><div class="line" id="LC11">&nbsp;</div></pre></div>
</div>
<div class="gist-meta">
<a href="https://gist.github.com/raw/185041/75baea8b5de141d632b36eea6c569bcf0bcf5428/gistfile1.txt" style="float:right;">view raw</a>
<a href="https://gist.github.com/185041">This Gist</a> brought to you by <a href="https://github.com">GitHub</a>.
</div>
</div>
</div>
<p>Integration problem solved with no integrated tests. Instead, I have a bunch of collaboration tests, one important contract test, and <del>the ability to notice things</del> a systematic approach to choosing the next test, which I describe in the comments below. Any questions?</p>
<blockquote style="font-size: small; font-style: italic;">
<p style="font-size: small; font-style: italic;">Dan Fabulich rightly jumped on me for using the phrase &#8220;an ability to notice things&#8221; just a little earlier in this article. I choose that phrase lazily because I didn&#8217;t want to patronize you by writing, &#8220;an ability to perform basic reasoning&#8221;. Oops. I thought about how I choose the next test, and I decided to take the time to include that here. Enjoy.</p>
</blockquote>
<p>In this example, I used no magic to choose the next test; but rather some fundamental reasoning.</p>
<p>Every time I say &#8220;I need <em>a thing</em> to do <em>X</em>&#8221; I introduce an interface. In my current test, I end up stubbing or mocking one of those tests.</p>
<p>Every time I <em>stub</em> a method, I make an assumption about what values that method can return. To check that assumption, I have to write a test that expects the return value I&#8217;ve just stubbed. I use only basic logic there: if A depends on B returning x, then I have to know that B can return x, so I have to write a test for that.</p>
<p>Every time I <em>mock</em> a method, I make an assumption about a service the interface provides. To check that assumption, I have to write a test that tries to invoke that method with the parameters I just expected. Again, I use only basic logic there: if A causes B to invoke c(d, e, f) then I have to know that I&#8217;ve tested what happens when B invokes c(d, e, f), so I have to write a test for that.</p>
<p>Every time I introduce a method on an interface, I make a decision about its behavior, which forms the <em>contract</em> of that method. To justify that decision, I have to write tests that help me implement that behavior correctly whenever I implement that interface. I write contract tests for that. Once again, I use only basic logic there: if A claims to be able to do c(d, e, f) with outcomes x, y, and z, then when B implements A, it must be able to do c(d, e, f) with outcomes x, y, and z (and possibly other non-destructive outcomes).</p>
<p>I simply kept applying these points over and over again until I stopped needing tests. Along the way, I found a problem and fixed it before it left my hands.</p>
<p>If I can describe the steps well enough for others to follow &#8211; and I posit I&#8217;ve just done that here &#8211; then I don&#8217;t agree to labeling it &#8220;magic&#8221;.</p>
