import React from "react";

export const App = (props) => {
  ////////////////
  //STATE
  ////////////////

  //Blank form object to initialize form and reset it
  const blankForm = {
    title: "",
    body: "",
  };

  // The State we'll save our API Data in
  const [blogs, setBlogs] = React.useState([]);

  //State for Our Create Blog Form, initialized with empty strings
  const [createForm, setCreateForm] = React.useState(blankForm);

  //State for Our Update Blog Form, initialized with empty strings
  const [updateForm, setUpdateForm] = React.useState(blankForm);

  ////////////////////////
  // FUNCTIONS
  ////////////////////////

  //Our function to grab the latest list of blogs
  const getBlogs = async () => {
    //We make a request to our backend server
    const response = await fetch("http://localhost:3000/blogs");
    //Convert the response into a javascript object
    const data = await response.json();
    //assign the data to our state
    setBlogs(data);
  };

  //Function that returns JSX to display blogs
  const BlogsLoaded = () => (
    <>
      {blogs.map((blog) => (
        <div>
          <h2>{blog.title}</h2>
          <h3>{blog.body}</h3>
          <button onClick={() => setUpdateForm(blog)}>Edit</button>
          <button onClick={() => handleDelete(blog)}>Delete</button>
        </div>
      ))}
    </>
  );

  // Variable with JSX to display if no blogs exist
  const noBlogs = <h1>No Blogs</h1>;

  //Function to update state when people type in create form
  const handleCreateChange = (event) => {
    //update the create form state determining the key and value based on the form fields name and value properties since it will be the event target.
    setCreateForm({ ...createForm, [event.target.name]: event.target.value });
  };

  const handleCreate = async (event) => {
    //prevent form from refreshing screen
    event.preventDefault();
    //make post request to our backend server
    const response = await fetch("http://localhost:3000/blogs", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createForm),
    });
    //update the list of blogs be refetching the list
    await getBlogs();
    //reset form
    setCreateForm(blankForm);
  };

  //Function to update state when people type in update form
  const handleUpdateChange = (event) => {
    //update the update form state determining the key and value based on the form fields name and value properties since it will be the event target.
    setUpdateForm({ ...updateForm, [event.target.name]: event.target.value });
  };

  const handleUpdate = async (event) => {
    //prevent form from refreshing screen
    event.preventDefault();
    //make put request to our backend server
    const response = await fetch(
      "http://localhost:3000/blogs/" + updateForm.id,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateForm),
      }
    );
    //update the list of blogs be refetching the list
    await getBlogs();
    //reset form
    setUpdateForm(blankForm);
  };

  const handleDelete = async (blog) => {
    //prevent form from refreshing screen
    event.preventDefault();
    //make delete request to our backend server
    const response = await fetch("http://localhost:3000/blogs/" + blog.id, {
      method: "delete",
    });
    //update the list of blogs be refetching the list
    await getBlogs();
  };

  /////////////////////////
  // useEffects
  /////////////////////////
  //useEffect to initially grab blogs when page loads
  React.useEffect(() => {
    getBlogs();
  }, []);

  /////////////////////////
  //RETURN JSX
  /////////////////////////
  //In the JSX below we run the BlogsLoaded function if there is at least one blog or render the contents of noBlogs if there isn't any.
  return (
    <div>
      <h1>The Blog App</h1>
      <h1>Create a Blog</h1>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          name="title"
          value={createForm.title}
          onChange={handleCreateChange}
        />
        <input
          type="text"
          name="body"
          value={createForm.body}
          onChange={handleCreateChange}
        />

        <input type="submit" value="Create Blog" />
      </form>
      <h1>Update a Blog</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="title"
          value={updateForm.title}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          name="body"
          value={updateForm.body}
          onChange={handleUpdateChange}
        />

        <input type="submit" value="Update Blog" />
      </form>
      <h1>Blogs</h1>
      {blogs.length > 0 ? BlogsLoaded() : noBlogs}
    </div>
  );
};
