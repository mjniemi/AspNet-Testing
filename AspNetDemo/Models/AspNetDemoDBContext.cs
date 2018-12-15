using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace AspNetDemo.Models
{
    public partial class AspNetDemoDBContext : DbContext
    {
        public AspNetDemoDBContext()
        {
        }

        public AspNetDemoDBContext(DbContextOptions<AspNetDemoDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Trainstation> Trainstation { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot config = new ConfigurationBuilder()
                    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                    .AddJsonFile("databasesettings.json")
                    .Build();
                optionsBuilder.UseSqlServer(config.GetConnectionString("SqlServerConnection"));
                //optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=AspNetDemoDB;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Trainstation>(entity =>
            {
                entity.ToTable("trainstation");

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasColumnName("countryCode")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Latitude).HasColumnName("latitude");

                entity.Property(e => e.Longitude).HasColumnName("longitude");

                entity.Property(e => e.PassengerTraffic).HasColumnName("passengerTraffic");

                entity.Property(e => e.StationName)
                    .IsRequired()
                    .HasColumnName("stationName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.StationShortCode)
                    .IsRequired()
                    .HasColumnName("stationShortCode")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.StationUiccode).HasColumnName("stationUICCode");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });
        }
    }
}
