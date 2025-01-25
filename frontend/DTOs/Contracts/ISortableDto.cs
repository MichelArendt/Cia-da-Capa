namespace frontend.DTOs.Contracts
{
    public interface ISortableDto
    {
        IReadOnlyList<SortField> SortFields { get; }
    }

    public class SortField
    {
        public string ColumnName { get; }
        public Func<ISortableDto, object> Selector { get; }

        public SortField(string columnName, Func<ISortableDto, object> selector)
        {
            ColumnName = columnName;
            Selector = selector;
        }
    }
}
