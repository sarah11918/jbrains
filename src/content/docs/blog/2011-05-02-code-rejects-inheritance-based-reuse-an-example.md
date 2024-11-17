---
title: "Code Rejects Inheritance-Based Reuse: An Example"
date: 2011-05-02
tags:
  - Dependency Inversion Principle (DIP)
---
We&#8217;ve read this before: don&#8217;t reuse code by subclassing. Instead, compose objects into a loose network that share responsibility for the system&#8217;s behavior. While practising, working through Growing Object-Oriented Systems, I reached the point where Steve and Nat started writing microtests, and decided to stray from the text and try it out on my own. I reached the stage where the first two system tests pass, but in the process, I introduced much cyclic dependency and duplication, particularly related to sending and parsing chat messages. In preparing to address this problem, I noticed some duplication in how the <em>auction</em> handles its incoming chats: sometimes it updated the UI, and sometimes it didn&#8217;t. I figured I&#8217;d turn those into two chat message handlers, separating the UI behavior from the non-UI behavior, and in so doing, introduced some temporary duplication.

```java
package ca.jbrains.auction.test;

public class Main implements MessageListener {
    // ...
    private void joinAuction(final XMPPConnection connection, String itemId)
            throws XMPPException {

        disconnectWhenUiCloses(connection);
        final Chat chat = connection.getChatManager().createChat(
                auctionId(itemId, connection), new MessageListener() {
                    // SMELL This nested class makes cyclic dependencies too
                    // easy
                    @Override
                    public void processMessage(Chat chat, Message message) {
                        // REFACTOR Replace conditional with polymorphism in
                        // each

                        // SMELL This duplicates code in Main's message
                        // listener,
                        // which probably means an abstraction in the middle is
                        // missing.
                        // REFACTOR? MessageListener parses messages and fires
                        // auction events; AuctionEventListener updates UI or
                        // sends chat message
                        final Object event = Messages.parse(message);
                        if (event instanceof BiddingState) {
                            BiddingState biddingState = (BiddingState) event;
                            if (!Main.SNIPER_XMPP_ID.equals(biddingState
                                    .getBidderName())) {
                                counterBid(chat);
                            }
                        }
                    }
                });

        chat.addMessageListener(this);

        this.dontGcMeBro = chat;

        chat.sendMessage(Messages.joinAuction());
    }
    
    //...
    
    @Override
    public void processMessage(Chat chat, Message message) {
        // SMELL This duplicates code in joinAuction()'s message listener,
        // which probably means an abstraction in the middle is
        // missing.
        // REFACTOR? MessageListener parses messages and fires
        // auction events; AuctionEventListener updates UI or
        // sends chat message
        Object event = Messages.parse(message);
        if (event instanceof BiddingState) {
            BiddingState biddingState = (BiddingState) event;
            if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                signalSniperIsBidding();
            }
        } else {
            signalAuctionClosed();
        }
    }
}
```

<p>You can probably see a straightforward way to start removing this duplication. To illustrate it, look at the following code snippet.</p>

```java
package ca.jbrains.auction.test;

public class Main {
    public static final class BidsForSniperMessageListener implements
            MessageListener {

        private Main main;

        public BidsForSniperMessageListener(Main main) {
            this.main = main;
        }

        // SMELL This nested class makes cyclic dependencies too
        // easy
        @Override
        public void processMessage(Chat chat, Message message) {
            // REFACTOR Replace conditional with polymorphism in
            // each

            // SMELL This duplicates code in Main's message
            // listener,
            // which probably means an abstraction in the middle is
            // missing.
            // REFACTOR? MessageListener parses messages and fires
            // auction events; AuctionEventListener updates UI or
            // sends chat message
            final Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                    main.counterBid(chat);
                }
            }
        }
    }

    public static class UpdatesMainWindowMessageListener implements
            MessageListener {
        private final Main main;

        public UpdatesMainWindowMessageListener(Main main) {
            this.main = main;
        }

        @Override
        public void processMessage(Chat chat, Message message) {
            // SMELL This duplicates code in joinAuction()'s message listener,
            // which probably means an abstraction in the middle is
            // missing.
            // REFACTOR? MessageListener parses messages and fires
            // auction events; AuctionEventListener updates UI or
            // sends chat message
            Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                    main.signalSniperIsBidding();
                }
            } else {
                main.signalAuctionClosed();
            }
        }
    }

    //...
}
```

<p>So we have two classes with a common field, a common method signature, and similar method bodies. Extract Superclass seems logical, even though I can&#8217;t think of a decent name for this class so far. No worry: it will come to me.</p>

```java
package ca.jbrains.auction.test;

public class Main {
    public static class FooMessageListener implements MessageListener {
        @Override
        public void processMessage(Chat chat, Message message) {
        }
    }

    public static final class BidsForSniperMessageListener extends
            FooMessageListener {
        
        private final Main main;

        public BidsForSniperMessageListener(Main main) {
            this.main = main;
        }

        @Override
        public void processMessage(Chat chat, Message message) {
            final Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                    main.counterBid(chat);
                }
            }
        }
    }

    public static class UpdatesMainWindowMessageListener extends
            FooMessageListener {

        private final Main main;

        public UpdatesMainWindowMessageListener(Main main) {
            this.main = main;
        }

        @Override
        public void processMessage(Chat chat, Message message) {
            Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                    main.signalSniperIsBidding();
                }
            } else {
                main.signalAuctionClosed();
            }
        }
    }
}
```

<p>Next, we have to extract the parts that differ from the parts the match each other. I did that by introducing new methods.</p>

```java
package ca.jbrains.auction.test;

public class Main {
    public static class FooMessageListener implements MessageListener {
        @Override
        public void processMessage(Chat chat, Message message) {
        }
    }

    public static final class BidsForSniperMessageListener extends
            FooMessageListener {
        
        private final Main main;

        public BidsForSniperMessageListener(Main main) {
            this.main = main;
        }

        // SMELL This nested class makes cyclic dependencies too
        // easy
        @Override
        public void processMessage(Chat chat, Message message) {
            final Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                handleBiddingStateEvent(chat, biddingState);
            }
        }

        private void handleBiddingStateEvent(Chat chat,
                BiddingState biddingState) {
            if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                main.counterBid(chat);
            }
        }
    }

    public static class UpdatesMainWindowMessageListener extends
            FooMessageListener {

        private final Main main;

        public UpdatesMainWindowMessageListener(Main main) {
            this.main = main;
        }

        @Override
        public void processMessage(Chat chat, Message message) {
            Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                handleBiddingStateEvent(biddingState);
            } else {
                handleAllOtherEvents();
            }
        }

        private void handleAllOtherEvents() {
            main.signalAuctionClosed();
        }

        private void handleBiddingStateEvent(BiddingState biddingState) {
            if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                main.signalSniperIsBidding();
            }
        }
    }
    //...
}
```

<p>Next, we make <code>processMessage()</code> identical in both classes, so as to pull it up into <code>FooMessageListener</code>. And here, we find our first warning sign about this refactoring. The signatures of <code>handleBiddingStateEvent()</code> don&#8217;t match:</p>

<ul><li><code>BidsForSniperMessageListener.handleBiddingStateEvent(Chat, BiddingState)</code></li>
<li><code>UpdatesMainWindowMessageListener.handleBiddingStateEvent(BiddingState)</code></li>
</ul><p>In order to find out whether this will become a problem, I have to add <code>Chat</code> to the parameter list for <code>UpdatesMainWindowMessageListener</code>&#8217;s implementation of the method, at least for now. I imagine I could do something more clever, but I&#8217;m not sure that introducing a closure over a <code>Chat</code> object would simplify matters. I can put that on my &#8220;to try&#8221; list for now. In the meantime, I add the <code>Chat</code> parameter. <a href="https://bit.ly/mnNv95" target="_blank">See the diff.</a></p>

<p>Now to turn similar <code>processMessage()</code> implementations into identical ones, I introduced an empty method. This is another warning sign, since I can&#8217;t envision a &#8220;default&#8221; UI update. Still, I reserve judgment until I have more evidence, and introduce the necessary changes. <a href="https://bit.ly/jjJQJI" target="_blank">See the diff.</a></p>

<p>Now that <code>processMessage()</code> looks identical in both subclasses, we can pull it up into <code>FooMessageListener</code>, for which we still don&#8217;t have a good name. Either <a href="https://bit.ly/mHVAaD" target="_blank">see the diff</a> or look at the final result below.</p>

```java
package ca.jbrains.auction.test;

public class Main {
    public static abstract class FooMessageListener implements MessageListener {
        @Override
        public void processMessage(Chat chat, Message message) {
            final Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                handleBiddingStateEvent(chat, biddingState);
            } else {
                handleAllOtherEvents();
            }
        }

        protected abstract void handleAllOtherEvents();

        protected abstract void handleBiddingStateEvent(Chat chat,
                BiddingState biddingState);
    }

    public static final class BidsForSniperMessageListener extends
            FooMessageListener {

        private final Main main;

        public BidsForSniperMessageListener(Main main) {
            this.main = main;
        }

        @Override
        protected void handleAllOtherEvents() {
            // I don't need to do anything here
        }

        @Override
        protected void handleBiddingStateEvent(Chat chat,
                BiddingState biddingState) {
            if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                main.counterBid(chat);
            }
        }
    }

    public static class UpdatesMainWindowMessageListener extends
            FooMessageListener {

        private final Main main;

        public UpdatesMainWindowMessageListener(Main main) {
            this.main = main;
        }

        @Override
        protected void handleAllOtherEvents() {
            main.signalAuctionClosed();
        }

        @Override
        protected void handleBiddingStateEvent(
                @SuppressWarnings("unused") Chat chat, BiddingState biddingState) {
            if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                main.signalSniperIsBidding();
            }
        }
    }
    //...
}
```

<p>Now that I look at this last version of <code>Main</code>, I see the value in having attempted this refactoring. It clarifies quite well the specific reasons why I won&#8217;t let inheritance play a long-term role in this part of the design. Specifically, look at the little problems with this design.</p>

<ul><li>I still can&#8217;t think of a good name for <code>FooMessageListener</code>, although maybe you&#8217;re screaming one at me as you read. (Sorry; I can&#8217;t hear you.)</li>
<li><code>BidsForSniperMessageListener.handleAllOtherEvents()</code> doesn&#8217;t need to do anything, which might or might not be a problem, but often points to the Refused Bequest smell.</li>
<li><code>UpdatesMainWindowMessageListener.handleBiddingStateEvent()</code> doesn&#8217;t need its <code>chat</code> parameter.</li>
<li>Both subclasses need a reference back to <code>Main</code>, but the superclass <code>FooMessageListener</code> doesn&#8217;t need it. Of course, that says more about <code>Main</code> in general than the <code>FooMessageListener</code> hierarchy: <code>Main</code> violates the Single Responsibility Principle in a variety of delightful ways. That&#8217;s why we&#8217;re here.</li>
</ul><p>So let me talk this through: we have subclasses of <code>FooMessageListener</code> that respond to the same logical stimuli, but different subclasses need different data and sometimes a subclasses doesn&#8217;t need to respond to the stimuli at all. <strong>That sounds an awful lot like an event mechanism to me.</strong></p>

<p>And if you look ahead in Steve and Nat&#8217;s book, that&#8217;s not surprising.</p>

<p>So how do we get from here to there? I plan to attack it this way:</p>

<ol><li>Make <code>FooMessageListener</code> an event source for this new type of event, which I&#8217;ll tentatively call an <code>AuctionEvent</code>.</li>
<li>Turn the subclasses into <code>AuctionEventListener</code>s.</li>
<li>Inline stuff back into place.</li>
</ol><p>You can follow the detailed changes on <a href="https://bit.ly/kdotl2" target="_blank">this branch</a> starting with <a href="https://bit.ly/mHVAaD" target="_blank">this commit</a>.</p>

<p>By the end of this session, I ended up with a new Auction Event concept, which has started separating the &#8220;chat message&#8221; concept from the &#8220;auction changed&#8221; event. It does, however, lead to other questions, which I&#8217;ve highlighted with <code>SMELL</code> and <code>REFACTOR</code> comments, so look for them. For now, I feel good that, while introducing a hierarchy had its problems, it helped me see how specifically to eliminate it. I trusted the mechanics, and it helped me see where to go next. I know I need to introduce an &#8220;auction closed&#8221; event and perhaps need to introduce an <code>AuctionEvent</code> object to eliminate the need for type checking in <code>AuctionEventSourceMessageListener</code>. We&#8217;ll go there next time, but in the meantime, peruse the current state of the code.</p>

```java
package ca.jbrains.auction.test;

public class Main {
    public interface AuctionEventListener {
        void handleNewBiddingState(BiddingState biddingState);

        void handleGenericEvent(Object object);
    }

    public static class AuctionEventSourceMessageListener implements
            MessageListener {

        private final List<AuctionEventListener> listeners;

        public AuctionEventSourceMessageListener() {
            this.listeners = new ArrayList<AuctionEventListener>();
        }

        public void addListener(AuctionEventListener listener) {
            listeners.add(listener);
        }

        @Override
        public void processMessage(Chat chat, Message message) {
            // SMELL Duplicated loops
            final Object event = Messages.parse(message);
            if (event instanceof BiddingState) {
                BiddingState biddingState = (BiddingState) event;
                for (AuctionEventListener each : listeners) {
                    each.handleNewBiddingState(biddingState);
                }
            } else {
                for (AuctionEventListener each : listeners) {
                    each.handleGenericEvent(event);
                }
            }
        }
    }
    //...
    private void joinAuction(final XMPPConnection connection, String itemId)
            throws XMPPException {

        disconnectWhenUiCloses(connection);

        final AuctionEventSourceMessageListener auctionEventSource = new AuctionEventSourceMessageListener();

        final Chat chat = connection.getChatManager().createChat(
                auctionId(itemId, connection), auctionEventSource);

        // SMELL? Programming by accident that I can't add these listeners in
        // the constructor of the Auction Event Source?
        auctionEventSource.addListener(new AuctionEventListener() {
            @Override
            public void handleNewBiddingState(BiddingState biddingState) {
                // REFACTOR? Should "sniper now losing" be an event?
                if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                    counterBid(chat);
                }
            }

            @Override
            public void handleGenericEvent(Object object) {
                // I can ignore this
            }
        });

        auctionEventSource.addListener(new AuctionEventListener() {
            @Override
            public void handleNewBiddingState(BiddingState biddingState) {
                // REFACTOR? Should "sniper now losing" be an event?
                if (!Main.SNIPER_XMPP_ID.equals(biddingState.getBidderName())) {
                    signalSniperIsBidding();
                }
            }

            @Override
            public void handleGenericEvent(Object object) {
                // REFACTOR Introduce an "auction closed" event
                signalAuctionClosed();
            }
        });

        this.dontGcMeBro = chat;

        chat.sendMessage(Messages.joinAuction());
    }
    //...
}
```

<p>If you prefer, <a href="https://bit.ly/iNyNbc" target="_blank">look at the changes</a> in moving from <code>MessageListener</code>s to <code>AuctionEventListener</code>s.</p>

<p>I hope I&#8217;ve shown how a code base can reject an attempt to reuse code by inheritance, prefering instead, in this case, composition implemented as an event chain.</p>
