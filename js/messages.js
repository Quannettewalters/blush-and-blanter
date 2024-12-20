function getMessage(m) {  
  const e = document.createElement("div");  
  e.setAttribute("class", "message");  
  e.dataset.post_id = m._id;  
  e.dataset.createdAt = m.createdAt; // Add dataset for filtering by date  
  e.dataset.likes = m.likes.length; // Add dataset for filtering by likes  
  const messageDate = new Date(m.createdAt);

    // Format the date and time
    const formattedDate = messageDate.toLocaleDateString(); // e.g., "12/20/2024"
    const formattedTime = messageDate.toLocaleTimeString(); // e.g., "3:45:30 PM"

  e.innerHTML = `  

  
    <hr>  
    FROM:  ${m.username}<br>    
    WHEN:  ${formattedDate} ${formattedTime}<br> <!-- Show date and time -->
    TEXT:  ${m.text}<br>  
    LIKES: ${m.likes.length}  
  `;  
  
  // Add the like button again for each message  
  const b = document.createElement("button");  
  b.addEventListener("click", async () => {  
    const like = m.likes.find(like => like.username === localStorage.username);  
    if (like !== undefined) {  
       await deleteLike(like._id);  
       window.location.href = 'messages.html'; // Refresh page  
    } else {  
       await sendLike(m._id);  
       window.location.href = 'messages.html'; // Refresh page  
    }  
  });  
   
  const like = m.likes.find(like => like.username === localStorage.username);  
  b.innerText = like !== undefined ? "UnLike" : "Like";  
  e.appendChild(b); // Append like button to message element  
  
  // Add the delete button  
if (m.username === localStorage.username) {  
  const deleteButton = document.createElement("button");  
  deleteButton.className = "delete-btn";  
  deleteButton.innerText = "Delete";  
  deleteButton.addEventListener("click", async () => {  
   try {  
    const response = await deleteMessage(m._id);  
    console.log(response);  
    // Remove the message from the UI  
    e.remove();  
   } catch (error) {  
    console.error(error);  
   }  
  });  
  e.appendChild(deleteButton); // Append delete button to message element  
}

  return e;  
}


// Show all messages (reset)
function showAllMessages(messages) {
  const output = document.getElementById("output");
  output.innerHTML = "";  // Clear previous messages
  messages.forEach((message) => {
      output.appendChild(message); // Append each message to the container
  });
}

// Filter messages by date
function filterMessagesByDate(messages, date) {
  const filteredMessages = messages.filter((message) => {
      const messageDate = message.dataset.createdAt.split("T")[0]; // Extract only the date part
      return messageDate === date;
  });

  showAllMessages(filteredMessages); // Show filtered messages
}

// Filter messages by relevance (most likes)
function filterMessagesByMostLikes(messages) {
  const sortedMessages = messages.sort((a, b) => {
      const likesA = parseInt(a.dataset.likes);
      const likesB = parseInt(b.dataset.likes);
      return likesB - likesA;
  });

  showAllMessages(sortedMessages); // Show sorted messages based on likes
}

document.addEventListener("DOMContentLoaded", async () => {
  const messages = await getMessageList();
  const output = document.getElementById("output");

  // Create message elements
  const messageElements = messages.map((m) => getMessage(m));

  // Initially display all messages
  showAllMessages(messageElements);

  const filterSelect = document.getElementById("filter-select");
  const dateFilter = document.getElementById("date-filter");

  // Handle filter selection
  filterSelect.addEventListener("change", (e) => {
      if (e.target.value === "date") {
          dateFilter.style.display = "inline-block"; // Show date filter input
          // Reset the date filter
          dateFilter.value = ""; 
          showAllMessages(messageElements); // Show all messages when switching to date filter
      } else {
          dateFilter.style.display = "none"; // Hide date filter
          if (e.target.value === "relevance") {
              filterMessagesByMostLikes(messageElements); // Apply relevance filter
          }
      }
  });

  // Handle date filtering
  dateFilter.addEventListener("change", (e) => {
      if (e.target.value) {
          filterMessagesByDate(messageElements, e.target.value); // Apply date filter
      } else {
          showAllMessages(messageElements); // Show all messages if no date is selected
      }
  });
});

