/**
 * 🧪 API Test Script
 * 
 * Tests the deployed Render.com API endpoints
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api'

async function testAPI() {
  console.log('🧪 Testing Character Generator API...')
  console.log(`📍 API URL: ${API_BASE_URL}`)
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Check...')
    const healthResponse = await fetch(`${API_BASE_URL}/health`)
    const healthData = await healthResponse.json()
    
    if (healthResponse.ok) {
      console.log('✅ Health Check:', healthData.status)
    } else {
      console.log('❌ Health Check Failed:', healthData.error)
    }
    
    // Test 2: Get Gallery
    console.log('\n2️⃣ Testing Gallery...')
    const galleryResponse = await fetch(`${API_BASE_URL}/gallery`)
    const galleryData = await galleryResponse.json()
    
    if (galleryResponse.ok) {
      console.log('✅ Gallery:', `${galleryData.characters.length} characters`)
    } else {
      console.log('❌ Gallery Failed:', galleryData.error)
    }
    
    // Test 3: Get Stats
    console.log('\n3️⃣ Testing Stats...')
    const statsResponse = await fetch(`${API_BASE_URL}/stats`)
    const statsData = await statsResponse.json()
    
    if (statsResponse.ok) {
      console.log('✅ Stats:', statsData)
    } else {
      console.log('❌ Stats Failed:', statsData.error)
    }
    
    // Test 4: Create Test Character
    console.log('\n4️⃣ Testing Character Creation...')
    const testCharacter = {
      name: 'Test Character',
      age: 25,
      height: 170,
      weight: 70,
      gender: 'unknown',
      isPublic: true,
      userId: 'test-user'
    }
    
    const createResponse = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        characterData: JSON.stringify(testCharacter)
      })
    })
    
    const createData = await createResponse.json()
    
    if (createResponse.ok) {
      console.log('✅ Character Created:', createData.character.name)
      
      // Test 5: Delete Test Character
      console.log('\n5️⃣ Testing Character Deletion...')
      const deleteResponse = await fetch(`${API_BASE_URL}/characters/${createData.character.id}`, {
        method: 'DELETE'
      })
      
      const deleteData = await deleteResponse.json()
      
      if (deleteResponse.ok) {
        console.log('✅ Character Deleted:', deleteData.message)
      } else {
        console.log('❌ Character Deletion Failed:', deleteData.error)
      }
    } else {
      console.log('❌ Character Creation Failed:', createData.error)
    }
    
    console.log('\n🎉 API Tests Complete!')
    
  } catch (error) {
    console.error('❌ Test Error:', error.message)
  }
}

// Run tests
testAPI()