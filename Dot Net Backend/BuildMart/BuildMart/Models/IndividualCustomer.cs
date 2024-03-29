﻿using System;
using System.Collections.Generic;

namespace BuildMart.Models
{
    public partial class IndividualCustomer
    {
        public int Id { get; set; }
        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? UserId { get; set; }

        public virtual User? User { get; set; }
    }
}
