using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todo_App.Infrastructure.Persistence.Migrations
{
    public partial class AddTodoItemBgColour : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BgColour",
                table: "TodoItems",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BgColour",
                table: "TodoItems");
        }
    }
}
