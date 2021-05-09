# Shiitake Posts

I created a standard post sharing app as described in the lab assignment. The site is supposed to be for mildly funny memes hence its name. The site has a blue and white theme with some animations like hover animations on links, animations between page transitions, and animated buttons. The site also has a search bar which you can type tags in to filter out posts by tags. To populate the site with content I got some of my friends to post stuff which was fun. I checked to make sure they did not post anything to crazy, but there is a chance I missed something so I apologize if that is the case. 

It is worth mentioning that the implementation for the post and new post are in the same Post Component file as recommended in the lab assignment.

[deployed url](https://unruffled-nightingale-6ea4fb.netlify.app/)

## What Worked Well

-I tried to keep the color scheme simple this time around so I tried to stick to only 3 colors (white, blue, dark blue) as much as possible. I think the site ended up looking good for my standards.

-I tried to limit myself from using React state whenever it made more sense to use Redux and I think I did an okay job at that. Overall, I feel like I understand redux and thunks a lot clearer. 

-Sharing the site with my friends and allowing them to post content on it was surprisingly really fun. The experience of getting to see something you built get used by others is awesome.  

-It was harder than expected to get the post and new post to work together as one component. In the end though, I think I did an okay job of making it happen. 

## What Didn't

-With the search bar, if you hold mouse on the search icon the focus leaves the search input. This does not impact functionality at all but it flashes the border around the search box which is kind of weird. I realized after making the search icon a clickable event that I could have just made the background of the input transparent, added some padding to the right, and then put the search icon behind the input box where the padding would be. This probably would have been made things a little simplier and fixed this little visual glitch. 

-I wanted to make the tags search algorithm a bit more robust by rankng the results of the search term, but after thinking about it for a bit I could only come up with algorithms that probably would have been really messy to implement, so I kept it relatively simple. 

-There is no animation between choosing to edit a post and confirming changes on a post. This was due to how the framer-motion package as it is set up in my project does animations based on whether the path changed. The path does not change when going to edit mode. I could probably add a new "..:postid/edit path". In the future, I will likely keep any major page transitions like a switch to an edit as a new path to make it work with framer-motion better.

## Extra Credit

For extra credit, 

  -I added input validation so that you have to fill out all parts of a new post form for it to be submitted. If you don't, then an error shows up telling you to do so.
  -I handled axios errors with a redux error state and two new actions for the error state. Whenever there was an error an error page pops up telling the user about the failure and what error message they got. 
  -I added a search bar that takes space seperated tags as input. It fetches from the server for new posts, then uses this input to filter through the posts. Specifically, it filters out all posts that do not contain each inputted tag as a substring in one of their tags. For example, if you type "cat" you get posts with tags like "cat","cat-person", etc. If multiple tags are inputted, then only posts that contain all inputted tags will be displayed. For example, if you type "cat dog" then you only get posts that contain both the "cat" and "dog" tags. So you would get posts with a tag like "cat-something-dog". Also posts that contain each tag individually so like a post with tags "cat-person" and "dog-person".
  -Lastly, I added a few animations using a few packages. The first package was "react-awesome-button". This button is used for the Edit, Delete, and Confirm buttons. It has some neat animations like if you move you mouse on hover it pushes down different parts of the button, and if you click a button it creates a cool ripple effect (you can see it the best if you try spamming the Confirm Button when confirming changes with empty invalid inputs). The second package was "framer-works" which I used to create the cool animation/transition on a page navigation in and out. The third package was the auto-resizing inputs package which allows the input fields for a new post to auto expand when typing. Also if you click the home page when on the home page it scrolls you to the top. The nav links/emojis have squishy animations when clicked. There is also some other miscellaneous styling. 

