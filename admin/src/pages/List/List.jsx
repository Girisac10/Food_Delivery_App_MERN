import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash } from "react-icons/fa"

const List = ({ url }) => {

  const [list, setList] = useState([])
  const [editingFood, setEditingFood] = useState(null)
  const [formData, setFormData] = useState({ name: "", category: "", price: "" })

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data)
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
    await fetchList()
    if (response.data.success) {
      toast.success(response.data.message)
    }
    else {
      toast.error("Error")
    }
  }

  const startEdit = (food) => {
    setEditingFood(food._id)
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price,
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const updateFood = async () => {
    try {
      const response = await axios.post(`${url}/api/food/update`, {
        id: editingFood,
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: formData.price.toString().trim(),
      })
      if (response.data.success) {
        toast.success(response.data.message)
        setEditingFood(null)
        fetchList()
      } else {
        toast.error("Update failed")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <div className="flex gap-2">
                <FaTrash onClick={() => removeFood(item._id)} className="cursor" />
                <FaEdit onClick={() => startEdit(item)} className="edit-icon" />
              </div>
            </div>
          )
        })}
      </div>

      {editingFood && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h3>Edit Food</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              placeholder="Category"
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="Price"
              onChange={handleChange}
            />

            <div className="edit-buttons">
              <button onClick={updateFood}>Save</button>
              <button onClick={() => setEditingFood(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default List