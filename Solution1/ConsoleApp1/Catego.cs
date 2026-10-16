using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    public class Catego
    {
        public byte categoryId;
        public String categoryName;

        public Catego( byte categoryId, string categoryName)
        {
            this.categoryId = categoryId;
            this.categoryName = categoryName; 
        }


    }
}
