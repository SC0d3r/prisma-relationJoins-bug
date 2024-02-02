const express = require('express')
const path = require('path');
const publicDirectoryPath = path.join(__dirname, 'public');

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient(/*options*/)

const app = express()
app.use(express.static(publicDirectoryPath));

app.get('/init_data', async (req, res) => {
  try {
    const response = await initPrismaDatas();
    res.json({ success: !!response })
  } catch (e) {
    console.log("::ERROR in init_data handler", e)
    res.json({ success: false })
  }
})

app.get("/bug", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        name: "Batman"
      },
      select: {
        books: {

          // Cause of the problem
          // if you dont use the 'relationJoins' previewFeatures 
          // then this works with no error
          orderBy: {
            genre: {
              ratings: {
                _count: "desc",
              }
            }
          },

          select: {
            title: true,
          }
        }
      }
    });

    console.log("fetched books are", books)
  } catch (e) {
    console.log("::ERROR in bug handler", e)
  } finally {
    res.redirect("http://localhost:3000/bug.html")
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000")
})

async function initPrismaDatas() {
  try {
    // reset datas
    await Promise.all([
      // reset users
      prisma.user.deleteMany({}),
      // reset books
      prisma.book.deleteMany({}),

      prisma.genre.deleteMany({}),

      prisma.rating.deleteMany({}),
    ]);

    // populate users
    await prisma.user.createMany({
      data: [
        { name: "DeadShot" },
        { name: "Batman" },
        { name: "Superman" },
        { name: "Harley" },
        { name: "Hulk" },
      ]
    });

    // populate genres
    await prisma.genre.createMany({
      data: [
        {
          title: "Action",
        },
        {
          title: "Drama",
        },
      ]
    });

    // populate ratings
    await prisma.rating.createMany({
      data: [
        {
          value: 5,
          genreTitle: "Action",
        },
      ]
    });

    // populate books
    await prisma.book.createMany({
      data: [
        {
          title: "The Lord of the Rings",
          bookGenreTitle: "Action",
        },
        {
          title: "Harry Potter",
          bookGenreTitle: "Action",
        }
      ]
    });

    const books = await prisma.book.findMany({})

    for (const b of books) {
      await Promise.all([
        await prisma.user.update({
          where: {
            name: "Batman"
          },
          data: {
            books: {
              connect: {
                id: b.id
              }
            }
          }
        }),
        prisma.user.update({
          where: {
            name: "Harley"
          },
          data: {
            books: {
              connect: {
                id: b.id
              }
            }
          }
        })
      ]);
    }

    console.log("✓ initializing data successfull")

    return true
  } catch (e) {
    console.log("::ERROR in initPrismaDatas", e)
    return false
  }
}